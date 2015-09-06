///<reference path="../../defs/jquery/jquery.d.ts"/>
///<reference path="../shared.ts"/>

module Ext.Parser {
    export class User implements CoreAppUser {
        private wykopURL: string = 'http://www.wykop.pl/';
        private cache: string = '';

        /**
         * Parsowanie strony wykopu
         * @param {function} parser   Parser
         * @param {boolean}  useCache Używanie cache strony głównej
         * @returns {JQueryPromise<any>}
         */
        private parseSource(parser: (html: string) => any, useCache: boolean = true) {
            if(useCache && this.cache.length)
                return $.Deferred().then(() => {
                    return parser(this.cache);
                });
            return $.get(this.wykopURL).then(parser);
        }

        /**
         * Pobieranie kodu źródłowego dymka
         * @param {string} tag Ścieżka do CSS przycisku
         * @returns {JQueryDeferred<T>}
         */
        private getSource(tag: string): JQueryDeferred<any> {
            let defer = $.Deferred();
            this.parseSource(html => {
                $.ajax({
                      type: 'GET'
                    , url: $(html).find(tag).attr('data-ajaxurl') + '/hash/' + html.match(/hash.*:."(.*)",/)[1]
                    , xhrFields: {
                        withCredentials: true
                    }
                }).fail(d => {
                    let html = d.responseText.match(/"data":{"html":"(.*)"}}/)[1];
                    html = html
                        .replace(/\\r|\\n|\\t/g, '')
                        .replace(/\\"/g, '"')
                        .replace(/\\\//g, '/');
                    defer.resolve($(html).find('p'));
                });
            }, true);
            return defer;
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
        public Notifications = {
              getCount: () => {
                return this.parseSource(html => {
                    return $(html).find('li.notification.m-user b').text();
                });
            }
            , getTagsCount: () => {
                return this.parseSource(html => {
                    return $(html).find('li.notification.m-tag b').text();
                });
            }
            , getList:     () => { return this.parseList('li.notification.m-user a'); }
            , getTagsList: () => { return this.parseList('li.notification.m-tag a'); }
        }
    }
}