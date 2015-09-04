///<reference path="../../shared.ts"/>
///<reference path="../interfaces.ts"/>
///<reference path="../popup.ts"/>

module Ext.UI {
    interface IUserScope extends CtrlScope<UserCtrl> {
        userInfo: WAPI.UserInfo;

        /** Powiadomienia */
        showTags: boolean;
        notifications: any[];
    }
    export class UserCtrl extends Controller {
        constructor(
              public $scope: IUserScope
            , public $location: ng.ILocationService
            , private background: Background
        ) {
            super($scope, {
                  userInfo: background.user.info
                , notifications: []
                , tagsNotifications: []
                , showTags: false
            });
            this.loadNotifications();
        }

        /** Pobieranie powiadomień */
        private loadNotifications() {
            this.background[this.$scope.showTags
                        ? 'getTagsNotifications'
                        : 'getNotifications'
                    ]().done(data => {
                this.$scope.notifications = data;
                this.$scope.$digest();
            });
        }

        /**
         * Ustawianie widocznej kategorii
         * @param {boolean} tags Widoczność tagów
         */
        public setCategory(tags: boolean = false) {
            this.$scope.showTags = tags;
            this.loadNotifications();
        }

        /** Wylogowywanie się */
        public logout() {
            this.$location.path('/login');
            this.background.logout();
        }
    }
    mod.controller('UserCtrl', UserCtrl)
}