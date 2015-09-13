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
    export let extApiClient: ExtAPI = null;

    export module UI {
        /** Serwis zasobów */
        export class Background {
            /** Metody skryptu background */
            public get user() {
                return this.api.then(data => {
                    return data.user;
                });
            }
            public get api(): JQueryPromise<ExtAPI> {
                return $
                    .Deferred()
                    .resolve((<any> chrome.extension.getBackgroundPage()).Ext.Background)
                    .promise();
            }
        }
        mod
            .service('background', Background)
            .run(($location: ng.ILocationService) => {
                $location.path('/login');
            });
            //.run(($location: ng.ILocationService, background: Background) => {
            //    $location.path(background.user ? '/user' : '/login');
            //});
    }
}