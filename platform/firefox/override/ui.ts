/// <reference path="../../../ext/ts/ui/background.ts"/>

module Ext.UI {
    /** Background script jest połączony z klientem w FF */
    Ext.UI.Background.apiCaller = (): Ext.ExtAPI => { return (<any> Ext).Background; };
    loadExtension();
}
