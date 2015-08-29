/**
 * Created by mateusz on 28.08.15.
 */
///<reference path="_tsd.ts"/>
///<reference path="routes.ts"/>

module Ext.UI {
    let mods = [
          'ui.router'
        , 'ngResource'
    ];
    export let mod = angular
        .module('app', mods)
        .config(routes);
}
/**
 * Rejestracja modułu rozszerzenia w angularze i
 * tworzenie podstawowego routingu
 */
(() => {
    angular
        .element(document)
        .ready(angular.bootstrap.bind(null, document, ['app']));
})();