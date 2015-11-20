///<reference path="../../../typings/tsd.d.ts" />
///<reference path="routes.ts"/>

module Ext.UI {
    export let mod = angular
        .module('app', ['ngRoute'])
        .config(routes);

    /**
     * Rejestracja modułu rozszerzenia w angularze i
     * tworzenie podstawowego routingu. Jako funkcja
     * bo wywoływany po dodaniu dodatków w overrides
     */
    export function loadExtension() {
        if(!_.isUndefined((<any>Ext).Background) || is.chrome())
            angular
                .element(document)
                .ready(angular.bootstrap.bind(null, document, ['app']));
    }
}