///<reference path="../../../typings/tsd.d.ts" />

module Ext.UI {
    export function routes(
          $compileProvider: ng.ICompileProvider
        , $routeProvider: ng.route.IRouteProvider
    ) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
        $routeProvider
            .when('/login', {
                  templateUrl: 'login.html'
                , controller: 'LoginCtrl'
            })
            .when('/user', {
                  templateUrl: 'user.html'
                , controller: 'UserCtrl'
            });
    }
}
