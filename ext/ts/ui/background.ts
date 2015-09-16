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
            public get user() {
                return this.api.then(function(data) {
                    let defer = $.Deferred();
                    if(data.user)
                        defer.resolve(data.user);
                    else
                        defer.reject();
                    return defer.promise();
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
            .run(($location: ng.ILocationService, background: Background) => {
                background.user
                    .done($location.path.bind($location, '/user'))
                    .fail($location.path.bind($location, '/login'));
            });
    }
}