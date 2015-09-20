///<reference path="../../../ext/ts/background/background.ts"/>

module Ext.Background {
    /** API pod chrome */
    browserApi = {
          openTab: (url: string) => { chrome.tabs.create({ url: url }); }
        , Badge: {
              setText: (text: string) => { chrome.browserAction.setBadgeText({ text: text.trim() }); }
            , setColor: (color: string) => { chrome.browserAction.setBadgeBackgroundColor({ color: color }); }
        }
    };
}