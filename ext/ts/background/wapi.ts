/**
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

///<reference path="../shared.ts"/>

module Ext.WAPI {
    /**
     * Aseracja, rzucanie wyjątkiem jeśli nie jest spełnione
     * @param {any}     condition Warunek
     * @param {boolean} message   Wiadomość w wyjątku
     */
    export function _assert(condition: any, message: string) {
        if(!condition)
            throw new Error(message);
    }

    /** Parametry wykopu w request */
    export type Params = { [index: string]: any };

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
            return $.ajax(<JQueryAjaxSettings> {
                  url: url
                , method: post && !_(post).isEmpty() ? 'POST' : 'GET'
                , data: post
                , async: async
                , headers: {
                      'apisign': CryptoJS.MD5(this.apiSecret + url + sortedPost.toString())
                    //, 'User-Agent': this.userAgent
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
            return data.userkey
                && new User(
                      this
                    , data.userkey
                    , <UserInfo> _(data).pick('login', 'avatar', 'rank', 'url', 'sex')
                );
        }

        /**
         * Szybkie tworzenie stałej metody API bez argumentów
         * @param {User}     user           Użytkownik
         * @param {string}   action         Akcja
         * @param {string[]} postArguments  Argumenty
         * @param {function} parser         Parser output
         * @returns Metoda API
         */
        public apiGetter(user: User, action: string, parser?: (data: any) => any, ...postArguments: string[]) {
            return (...args: any[]): JQueryPromise<any> => {
                let postData: Params = {};
                _(postArguments).each((arg, index) => {
                    postData[arg] = args[index];
                });
                return this.request(action, {}, user && user.userKey, true, postData)
                    .then(data => {
                        return parser ? parser(data) : data;
                    });
            };
        }
    }

    /** Użytkownik wykopu */
    export class User implements CoreAppUser {
        constructor(
              private client: Client
            , public userKey: string
            , public info: UserInfo
        ) {
        }

        /** Pobieranie klienta API */
        public get apiClient() { return this.client; }

        /** Metody dot. powiadomień */
        public Notifications = {
            /** Pobieranie liczby powiadomień tekstowych */
              getCount: this.client.apiGetter(this, 'mywykop/notificationscount')
            , getList: this.client.apiGetter(this, 'mywykop/notifications')

            /** Pobieranie listy powiadomień tag */
            , getTagsCount: this.client.apiGetter(this, 'mywykop/hashtagsnotificationscount')
            , getTagsList: this.client.apiGetter(this, 'mywykop/hashtagsnotifications')
        };

        /** Metody mikrobloga */
        public Entries = {
            /**
             * Pobieranie listy wiadomości z mikrobloga
             * @param {number} page   Numer strony
             */
              index: (page: number = 0) => {
                return this.client.apiGetter(this, 'stream/index', null, 'page')(page);
            }
            /**
             * Pobieranie listy najaktywniejszych dyskusji z mikrobloga
             * @param {number} page   Numer strony
             * @param {number} period Okres czasu
             */
            , hot: (page: number = 0, period: number = 6) => {
                return this.client.apiGetter(this, 'stream/hot', null, 'page', 'period')(page, period);
            }
            /**
             * Wysyłanie wiadomości na mikrobloga
             * @param {string} text Zawrtość wiadomości
             */
            , add: (text: string) => {
                return this.client.apiGetter(this, 'entries/add', null, 'body')(text);
            }
        };

        /**
         * Pobieranie linków z wykopu
         * @param {LinksCategory}   category Kategoria, z której ma być pobierany
         * @param {SortBy}          sort     Określanie metody sortowania
         */
        public links( category: LinksCategory = LinksCategory.PROMOTED
                    , sort: SortBy = null) {
            return this.client.request('links/' + category, { sort: sort });
        }
    }
}