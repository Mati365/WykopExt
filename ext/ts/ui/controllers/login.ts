///<reference path="../../shared.ts"/>
///<reference path="../interfaces.ts"/>
///<reference path="../mod.ts"/>

module Ext.UI {
    interface LoginScope extends CtrlScope<LoginCtrl> {
        data: LoginData;
        error: string;
        apiMode: boolean; // apiMode nie potrzebuje zadnych danych usera
    }
    export class LoginCtrl extends Controller {
        constructor(
              public $scope: LoginScope
            , private $location: ng.ILocationService
            , private background: Background
        ) {
            super($scope, {
                apiMode: false
            });
        }

        /** Logowanie się do background */
        public login() {
            if(this.background.api.setApiMode(this.$scope.apiMode)
                    || this.background.api.login(this.$scope.data))
                this.$location.path('/user');
            else
                this.$scope.error = 'Błędne dane logowania :(';
        }
    }
    mod.controller('LoginCtrl', LoginCtrl)
}