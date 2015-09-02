///<reference path="../../defs/chrome/chrome.d.ts"/>
///<reference path="../shared.ts"/>
///<reference path="popup.ts"/>

module Ext {
    /** Użytkownik API */
    export interface User {
        userKey: string;
        info: WAPI.UserInfo;
    }

    /** Metody API */
    export interface ExtAPI {
        user: User;
        login(data:LoginData);
    }
    export module UI {
        export class Background {
            private api: ExtAPI = (<any> chrome.extension.getBackgroundPage()).Ext.Background;

            /** Metody skryptu background */
            public get user():User { return this.api.user; }
            public login = this.api.login;
        }
        mod
            .service('background', Background)
            .run(($location:ng.ILocationService, background:Background) => {
                $location.path(background.user ? '/user' : '/login');
            })
    }
}