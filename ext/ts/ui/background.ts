///<reference path="../../defs/chrome/chrome.d.ts"/>
///<reference path="popup.ts"/>

module Ext.UI {
    export interface ExtAPI {
        user: any;
        login(data: ILoginData);
    }
    export class Background {
        private api: ExtAPI = (<any> chrome.extension.getBackgroundPage()).Ext.Background;

        /** Metody skryptu background */
        public get user(): any { return this.api.user; }
        public login = this.api.login;
    }
    mod
        .service('background', Background)
        .run(($location: ng.ILocationService, background: Background) => {
            $location.path(background.user ? '/user' : '/login');
        })
}