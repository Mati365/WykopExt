/// <reference path="../../../ext/ts/ui/background.ts"/>

module Ext.UI {
    Ext.UI.Background.apiCaller = (): Ext.ExtAPI => {
        return (<any> chrome.extension.getBackgroundPage()).Ext.Background;
    };
    loadExtension();
}
