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
            private background: ExtAPI = (<any> chrome.extension.getBackgroundPage()).Ext.Background;

            /** Metody skryptu background */
            public get user(): CoreAppUser { return this.background.user; }
            public get api(): ExtAPI { return this.background; }
        }

        /** Otwieranie nowych linków w nowych zakładkach */
        export class ExtHref implements ng.IDirective {
            public restrict: string = 'A';
            public link: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: any) => {
                $(element)
                    .attr('href', attrs.extHref)
                    .click(() => {
                        chrome.tabs.create({ url: attrs.extHref });
                    });
            };

            static factory(): ng.IDirectiveFactory {
                return () => new ExtHref;
            }
        }
        mod
            .service('background', Background)
            .directive('extHref', ExtHref.factory())
            .run(($location: ng.ILocationService, background: Background) => {
                $location.path(background.user ? '/user' : '/login');
            })
    }
}