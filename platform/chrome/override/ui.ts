///<reference path="../../../ext/ts/ui/background.ts"/>

module Ext.UI {
    Ext.UI.Background.apiGetter = (): Ext.ExtAPI => {
        return (<any> chrome.extension.getBackgroundPage()).Ext.Background;
    };
    loadExtension();
}
