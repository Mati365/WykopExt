/// <reference path="../../../ext/ts/ui/background.ts"/>

module Ext.UI {
    mod.run(($location: ng.ILocationService, background: Background) => {
        console.log(background);
    });
}