///<reference path="../../../ext/ts/background/background.ts"/>

module Ext.Background {
    /** API pod konkretną przeglądarkę */
    browserApi = <BrowserAPI> {
        Badge: {
            setText: (text: string): BrowserAPI => {
                return browserApi;
            }
            , setColor: (color: string): BrowserAPI => {
                return browserApi;
            }
        }
    };
}
