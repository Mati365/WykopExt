///<reference path="../../../ext/ts/background/background.ts"/>

module Ext.Background {
    /** API pod konkretną przeglądarkę */
    browserApi = {
        Badge: {
              setText: (text: string): BrowserAPI => {
                return browserApi;
            }
            , setColor: (color: string): BrowserAPI => {
                return browserApi;
            }
        }
    };

    /** Nadpisanie API */
    declare let self;
    self.on('get-api', message => {
        console.log('e');
        self.port.emit('get-api', {
              logout: logout
            , login: login
            , setApiMode: setApiMode
            , user: user
            , notifyCount: notifyCount
            , tagsCount: tagsCount
        });
    });
}
