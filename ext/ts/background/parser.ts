///<reference path="../../defs/jquery/jquery.d.ts"/>
///<reference path="../shared.ts"/>

module Ext.Parser {
    interface UserCache {
        html: string;
        hash: string;
        expDate: number;
    }
    export class User implements CoreAppUser {
        private wykopURL: string = 'http://www.wykop.pl/';

        /**
         * Parsowanie strony wykopu
         * @param {function} parser   Parser
         * @param {boolean}  useCache Używanie cache strony głównej
         * @returns {JQueryPromise<any>}
         */
        private cache: UserCache = {
              html: ''
            , hash: ''
            , expDate: 0
        };
        private parseSource(parser: (html: string) => any) {
            if(this.cache.html.length && new Date().getTime() < this.cache.expDate)
                return parser(this.cache.html);

            return $.get(this.wykopURL).then(html => {
                this.cache = {
                      html: html
                    , hash: html.match(/hash.*:."(.*)",/)[1]
                    , expDate: new Date().getTime() + 6000000
                };
                return parser(html);
            });
        }

        /**
         * Tworzenie requestu do Wykopu
         * @param {string} link Link
         */
        private makeAjax2Request(link: string) {
            let defer = $.Deferred();
            $
                .ajax(<JQueryAjaxSettings> {
                      type: 'GET'
                    , url: this.wykopURL + '/' + link + '/hash/' + this.cache.hash
                    , xhrFields: {
                        withCredentials: true
                    }
                })
                .fail(d => {
                    if(d.responseText)
                        defer.resolve(d.responseText);
                    else
                        defer.reject();
                });
            return defer;
        }

        /** Pobieranie ilości powiadomień */
        private getNotificationsCount() {
            return this.makeAjax2Request('ajax2/powiadomienia/mine').then((d: string) => {
                let notify = d.match(/"count":(\d*),"hcount":(\d*)/);
                if(!notify) {
                    this.cache.html = '';
                    return [0, 0];
                } else
                    return [notify[1], notify[2]];
            });
        }

        /**
         * Pobieranie kodu źródłowego dymka
         * @param {string} tag Ścieżka do CSS przycisku
         * @returns {JQueryDeferred<T>}
         */
        private getSource(tag: string) {
            return this.parseSource(html => {
                return this.makeAjax2Request($(html).find(tag).attr('data-ajaxurl')).then((d: string) => {
                    let html = d.match(/"data":{"html":"(.*)"}}/)[1];
                    html = html
                        .replace(/\\r|\\n|\\t/g, '')
                        .replace(/\\"/g, '"')
                        .replace(/\\\//g, '/');
                    return $(html).find('p');
                });
            });
        }

        /**
         * @param {string} tag Ścieżka do CSS przycisku
         * @returns {any[]}
         */
        private parseList(tag: string) {
            return this.getSource(tag).then(lines => {
                return _(lines).map(element => {
                    $(element).find('em').append(' ');
                    $(element).find('a').append(' ').prepend(' ');

                    let matches = $(element).find('img, em');
                    return {
                          'author_avatar': $(matches[0]).attr('src')
                        , 'url': $(element).find('a').last().attr('href')
                        , 'new': $(element)
                                    .parent()
                                    .hasClass('type-light-warning')
                        , 'body': $(element).text()
                    };
                });
            });
        }

        /** Metody API */
        private cachedNotifications: number[] = [0, 0];
        public Notifications = {
              getCount: () => {
                return this.getNotificationsCount().then(data => (this.cachedNotifications = <any> data)[0]);
            }
            , getTagsCount: () => {
                return $.Deferred().resolve(this.cachedNotifications[1]).promise();
            }

            /** Lista powiadomień */
            , getList:     this.parseList.bind(this, 'li.notification.m-user a')
            , getTagsList: this.parseList.bind(this, 'li.notification.m-tag a')
        }
    }
}