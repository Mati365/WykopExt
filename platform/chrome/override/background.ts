///<reference path="../../../ext/ts/background/background.ts"/>

module Ext.Background {
    /** API pod konkretną przeglądarkę */
    browserApi = {
        Badge: {
            setText: (text: string): BrowserAPI => {
                chrome.browserAction.setBadgeText({ text: text.trim() });
                return browserApi;
            }
            , setColor: (color: string): BrowserAPI => {
                chrome.browserAction.setBadgeBackgroundColor({ color: color });
                return browserApi;
            }
        }
    };
}