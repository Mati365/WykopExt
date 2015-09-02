/// <reference path="defs.ts" />

/**
 * Interfejsy modyfikujące domyślne
 * interfejsy angulara
 */
module Ext.UI {
    /**
     * Nie trzeba w klasie kontrolleru
     * bindować miliona metod i można
     * np. w ng-click='caller.dupa()'
     */
    export interface CtrlScope<T> extends ng.IScope {
        fn: T;
    }
    export class Controller {
        constructor($scope: any, params: any = {}) {
            (<any>_).extendOwn($scope, params);
            $scope.fn = this;
        }
    }
}