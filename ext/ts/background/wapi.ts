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
         * Tworzenie requestu do API
         * @param {string}   action   Akcja np. 'microblog/index'
         * @param {string}   params   Parametry np. '1' => 'microblog/index/1'
         * @param {any}      post     Dane POST'a
         * @return Promise
         */
        public request(action: string, params: { [index: string]: any }, post?: any) {
            _assert(action, 'Action cannot be null!');

            /** Parsowanie listy parametrów na parametry akceptowane przez wykop */
            let parsedParams = _(params).map((val, key) => {
                return key + ',' + val;
            }).join(',');

            /** Tworzenie URL dla zapytania */
            let url = (<any> '{url}/{action}/{params}{key}').format({
                  url: this.apiURL
                , action: action
                , params: parsedParams || ''
                , key: (parsedParams.length ? ',' : '') + 'appkey,' + this.apiKey
            });

            /** Wykonywanie zapytania */
            return $.ajax({
                  url: url
                , method: post ? 'POST' : 'GET'
                , data: post
                , headers: {
                    apisign: CryptoJS.MD5(this.apiSecret + url)
                }
            })
        }

        /**
         * Pobieranie linków z wykopu
         * @param {LinksCategory}   category Kategoria, z której ma być pobierany
         * @param {SortBy}          sort     Określanie metody sortowania
         * @return Promise
         */
        public links( category: LinksCategory = LinksCategory.PROMOTED
                    , sort: SortBy = null) {
            return this.request('links/' + category, { sort: sort });
        }
    }

    new Client('AiwnrjVTJi', '2TeQ7KVdVV').links().done(data => {
        console.log(data);
    });
}