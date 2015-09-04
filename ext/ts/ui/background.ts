///<reference path="../shared.ts"/>
///<reference path="popup.ts"/>

module Ext {
    /** Użytkownik API */
    export interface User {
        userKey: string;
        info: WAPI.UserInfo;
        Notifications: {
            getList();
            getTagsList();
        };
    }

    /** Metody API */
    export interface ExtAPI {
        user: User;
        login(data: LoginData);
        logout();
    }
    export module UI {
        export class Background {
            private api: ExtAPI = (<any> chrome.extension.getBackgroundPage()).Ext.Background;

            /** Metody skryptu background */
            public get user(): User { return this.api.user; }
            public login = this.api.login;
            public logout = this.api.logout;

            /** Pobieranie powiadomień */
            public getNotifications()     { return this.api.user.Notifications.getList(); }
            public getTagsNotifications() { return this.api.user.Notifications.getTagsList(); }
        }
        mod
            .service('background', Background)
            .run(($location: ng.ILocationService, background: Background) => {
                $location.path(background.user ? '/user' : '/login');
            })
    }
}