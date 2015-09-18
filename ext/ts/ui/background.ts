///<reference path="../shared.ts"/>
///<reference path="mod.ts"/>

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
            public static apiCaller: () => ExtAPI = null;

            /** Metody skryptu background */
            public get user(): CoreAppUser { return this.api.user; }
            public get api(): ExtAPI {
                if(!Background.apiCaller)
                    throw new Error('Unsupported platform!');
                return Background.apiCaller();
            }
        }
        mod
            .service('background', Background)
            .run(($location: ng.ILocationService, background: Background) => {
                $location.path(background.user ? '/user' : '/login');
            });
    }
}