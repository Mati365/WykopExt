/**
 * Created by mateusz on 29.08.15.
 * Podstawowy routing rozszerzenia
 */
///<reference path="_tsd.ts"/>

module Ext.UI {
    export function routes(
        $stateProvider: ng.ui.IStateProvider
    ) {
        $stateProvider
            /** Ekran błędu */
            .state('login', {
                  url: '/login'
                , templateUrl: 'login.html'
                , controller: 'LoginCtrl'
            });
    }
}
