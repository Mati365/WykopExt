///<reference path="../../shared.ts"/>
///<reference path="../interfaces.ts"/>
///<reference path="../popup.ts"/>

module Ext.UI {
    interface LoginScope extends ICtrlScope<Login> {
        data: ILoginData;
        error: string;
    }
    class Login extends Controller {
        constructor(
              public $scope: LoginScope
            , private $location: ng.ILocationService
            , private background: Background
        ) {
            super($scope);
        }

        /** Logowanie się do background */
        public login() {
            if(this.background.login(this.$scope.data))
                this.$location.path('/user');
            else
                this.$scope.error = 'Błędne dane logowania :(';
        }
    }
    mod.controller('LoginCtrl', Login)
}