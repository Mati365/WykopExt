/**
 * Created by mateusz on 30.08.15.
 * Kod współdzielony przez popup
 */
///<reference path="../defs/jquery/jquery.d.ts"/>

module Ext {
    /** Dane logowania */
    export interface LoginData extends Storage {
        apiKey: string;
        apiSecret: string;
        userLogin: string;
        userKey: string;
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