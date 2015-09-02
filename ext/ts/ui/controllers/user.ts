///<reference path="../../shared.ts"/>
///<reference path="../interfaces.ts"/>
///<reference path="../popup.ts"/>

module Ext.UI {
    interface IUserScope extends CtrlScope<UserCtrl> {
        userInfo: WAPI.UserInfo;
    }
    export class UserCtrl extends Controller {
        constructor(
              public $scope: IUserScope
            , private background: Background
        ) {
            super($scope, {
                userInfo: background.user.info
            });
        }
    }
    mod.controller('UserCtrl', UserCtrl)
}