///<reference path="defs.ts"/>
///<reference path="routes.ts"/>

module Ext.UI {
    let mods = [
          'ngRoute'
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