///<reference path="../../defs/chrome/chrome.d.ts"/>
///<reference path="popup.ts"/>

module Ext.UI {
    export interface ExtAPI {
        user: any;
        login(apiKey: string, apiSecret: string, login: string, key: string);
    }
    export class Background {
        private api: ExtAPI = (<any> chrome.extension.getBackgroundPage()).Ext.Background;
        public isLogged(): boolean {
            return this.api.user;
        }
    }
    mod
        .service('background', Background)
        .run(($state: ng.ui.IStateService, background: Background) => {
            !background.isLogged() && $state.go('login');
        })
}