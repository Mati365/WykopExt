/**
 * Created by mateusz on 28.08.15.
 * WAPI v.0.0.1
 *
 * Prosta implemenetacja API wykopu potrzebna
 * do pobraniu informacji o zdarzeniach, może w
 * przyszłości rozszerzy się to o jakieś inne
 * funkcje..
 */
///<reference path="../../defs/jquery/jquery.d.ts"/>
///<reference path="../../defs/cryptojs/cryptojs.d.ts"/>
///<reference path="../../defs/underscore/underscore.d.ts"/>

module Ext.WAPI {
    /** Format z python'a */
    String.prototype['format'] = function(...params: any[]): string {
        return this.replace(/\{(\w*)\}/g, (match, val) => {
            return isNaN(val) ? params[0][val] : params[val];
        });
    };

    /**
     * Aseracja, rzucanie wyjątkiem jeśli nie jest spełnione
     * @param {any}     condition Warunek
     * @param {boolean} message   Wiadomość w wyjątku
     */
    function _assert(condition: any, message: string) {
        if(!condition)
            throw new Error(message);
    }

    /** Linki */
    export enum LinksCategory {
          PROMOTED = <any>'promoted'
        , UPCOMING = <any>'upcoming'
    }

    /** Typ sortowania */
    export enum SortBy {
          DAY   = <any>'day'
        , WEEK  = <any>'week'
        , MONTH = <any>'month'
    }

    /** Parametry wykopu w request */
    type Params = { [index: string]: any };

    /** Podstawowy klient WAPI */
    export class Client {
        /** Wartości stałe */
        public apiURL: string = 'http://a.wykop.pl';
        public userAgent: string = 'WykopExt';

        constructor(
              public apiKey: string
            , public apiSecret: string
        ) {}

        /**
         * Przekształcanie tablic asocjacyjnych na argumenty typ dupa,2,appkey,123
         * @param {Params}  params Parametry
         */
        public static parseParams(params: Params) {
            /** Sortowanie alfabetyczne */
            let keys = _(params).keys();
            return _(keys).reduce((memo, key, index) => {
                return memo + key + ',' + params[key] + (index === keys.length - 1 ? '' : ',');
            }, '');
        }

        /**
         * Tworzenie requestu do API
         * @param {string}   action   Akcja np. 'microblog/index'
         * @param {Params}   params   Parametry np. '1' => 'microblog/index/1'
         * @param {string}   userkey  Klucz użytkownika
         * @param {boolean}  async    Jeśli true, jest asymchroniczne
         * @param {Params}   post     Dane POST'a
         * @returns Promise
         */
        public request(action: string, params: Params, userkey?: string, async: boolean = true, post?: Params) {
            _assert(action, 'Action cannot be null!');

            /** Tworzenie URL dla zapytania */
            let urlParams = _(params).keys().length ? (Client.parseParams(params) + ',') : '';
            let url = (<any> '{url}/{action}/{key}{params}').format({
                  url: this.apiURL
                , action: action
                , params: urlParams
                , key: 'appkey,' + this.apiKey + (userkey ? ',userkey,' + userkey : '')
            });

            /** Wykonywanie zapytania */
            let sortedPost = _(post).sortBy((val, key) => {
                return key;
            });
            return $.ajax({
                  url: url
                , method: post ? 'POST' : 'GET'
                , data: post
                , async: async
                , headers: {
                      'apisign': CryptoJS.MD5(this.apiSecret + url + sortedPost.toString())
                    , 'User-Agent': this.userAgent
                }
            });
        }

        /**
         * Pobieranie klucza użytkownika
         * @param {string} login      Login
         * @param {string} accountKey Klucz konta
         * @returns Promise
         */
        public login(login: string, accountKey: string) {
            let data: any = this.request('user/login', {}, null, false, {
                  login: login
                , accountkey: accountKey
            }).responseJSON;

            /** Tworzenie użytkownika na podstawie odpowiedzi serwera */
            return new User(this
                , data.userkey
            );
        }

        /**
         * Szybloe tworzenie stałem metody API niezależnej od argumentów
         * @param {User}     user           Użytkownik
         * @param {string}   action         Akcja
         * @param {string[]} postArguments  Argumenty
         * @param {function} parser         Parser output
         * @returns Metoda API
         */
        public apiGetter(user: User, action: string, parser?: (data: any) => any, ...postArguments: string[]) {
            return (...args: any[]) => {
                let postData: Params = {};
                _(postArguments).each(arg => {
                    postData[arg] = args[arg];
                });
                return this.request(action, {}, user && user.userKey, true, postData)
                    .then(data => {
                        return parser ? parser(data) : data;
                    });
            };
        }

        /**
         * Pobieranie linków z wykopu
         * @param {LinksCategory}   category Kategoria, z której ma być pobierany
         * @param {SortBy}          sort     Określanie metody sortowania
         * @returns Promise
         */
        public links( category: LinksCategory = LinksCategory.PROMOTED
                    , sort: SortBy = null) {
            return this.request('links/' + category, { sort: sort });
        }
    }

    /** Powiadomienie */
    export interface Notification {
        author: string;
        author_avatar: string;
        date: string;
        body: string;
        url: string;
    }

    /** Użytkownik wykopu */
    export class User {
        constructor(
              private client: Client
            , public userKey: string) {
        }

        /** Metody dot. powiadomień */
        public Notifications = {
            /** Pobieranie liczby powiadomień tekstowych */
              getCount: this.client.apiGetter(this, 'mywykop/notificationscount')
            , getList: this.client.apiGetter(this, 'mywykop/notifications', data => {
                return _(data).map(val => {
                    return <Notification> _(val).pick('author', 'author_avatar', 'date', 'body', 'url');
                });
            })

            /** Pobieranie listy powiadomień tag */
            , getTagsCount: this.client.apiGetter(this, 'mywykop/hashtagsnotificationscount')
            , getTagsList: this.client.apiGetter(this, 'mywykop/hashtagsnotifications')
        };

        public Entry = {
            /**
             * Wysyłanie wiadomości na mikrobloga
             * @param {string} text Zawrtość wiadomości
             */
            add: (text: string)=> {
                this.client.request('entries/add', {}, this.userKey, true, { body: text });
            }
        };
    }

    /** Użytkownik wykopu */
    new Client('', '')
        .login('Babok', '')
        .Notifications.getList().done(d => {
            console.log(d);
        });
}