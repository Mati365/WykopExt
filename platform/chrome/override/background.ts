///<reference path="../../../ext/ts/background/background.ts"/>

module Ext.Background {
    /** API pod chrome */
    browserApi = {
        Badge: {
              setText: (text: string) => { chrome.browserAction.setBadgeText({ text: text.trim() }); }
            , setColor: (color: string) => { chrome.browserAction.setBadgeBackgroundColor({ color: color }); }
        }
    };
}