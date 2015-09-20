///<reference path="../defs/jquery/jquery.d.ts"/>

module Ext {
    /** Format z python'a */
    String.prototype['format'] = function(...params: any[]): string {
        return this.replace(/\{(\w*)\}/g, (match, val) => {
            return isNaN(val) ? params[0][val] : params[val];
        });
    };

    /** API specyficzne dla przeglądarki */
    export interface BrowserAPI {
          openTab: (url: string) => void
        , Badge: {
              setText: (text: string) => void
            , setColor: (color: string) => void
        }
    }

    /** Dane logowania */
    export interface LoginData extends Storage {
        apiMode: boolean;
        apiKey: string;
        apiSecret: string;
        userLogin: string;
        userKey: string;
    }

    /** Podstawowy użytkownik Appki, tylko potrzebne metody */
    export interface CoreAppUser {
        Notifications: {
            getCount();
            getList();
            getTagsCount();
            getTagsList();
        }
    }

    /** Interfejsy WAPI */
    export module WAPI {
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

        /** Informacje o użytkowniku */
        export interface UserInfo {
            login: string;
            rank: number;
            avatar: string;
            url: string;
        }
    }
}