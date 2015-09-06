///<reference path="../shared.ts"/>
///<reference path="popup.ts"/>

module Ext {
    /** Metody background */
    export interface ExtAPI {
        user: CoreAppUser;
        notifyCount: number;
        tagsCount: number;

        setApiMode(apiMode: boolean);
        login(data: LoginData);
        logout();
    }
    export module UI {
        /** Serwis zasobów */
        export class Background {
            /** Metody skryptu background */
            public get user(): CoreAppUser { return this.api.user; }
            public get api(): ExtAPI {
                return (<any> chrome.extension.getBackgroundPage()).Ext.Background;
            }
        }
        mod
            .service('background', Background)
            .run(($location: ng.ILocationService, background: Background) => {
                $location.path(background.user ? '/user' : '/login');
            })
    }
}