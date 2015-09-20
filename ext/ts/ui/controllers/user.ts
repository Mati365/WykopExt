///<reference path="../../shared.ts"/>
///<reference path="../interfaces.ts"/>
///<reference path="../mod.ts"/>

module Ext.UI {
    interface IUserScope extends CtrlScope<UserCtrl> {
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
                  notifications: []
                , tagsNotifications: []
            });

            /** Firefox nie odświeża popupa po każdym pokazaniu */
            this.reloadNotifications();
            $(document).on('reload-notifications', this.reloadNotifications.bind(this));

        }

        /** Ponowne wczytywnie wydarzeń na FF */
        private reloadNotifications() {
            this.setCategory(
                <any> !this.background.api.notifyCount && <any> this.background.api.tagsCount
            );
        }

        /** Pobieranie powiadomień */
        private loadNotifications() {
            /** w background jest asynchronicznie i może się nie zalogować */
            if(!this.background.user) {
                setTimeout(this.loadNotifications.bind(this), 1000);
                return;
            }
            this.$scope.notifications = [];
            this.background.user.Notifications
                    [this.$scope.showTags
                    ? 'getTagsList'
                    : 'getList'
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
            this.background.api.logout();
        }
    }

    mod
        .controller('UserCtrl', UserCtrl)
        .filter('trusted', function($sce){
            return text => {
                text = text.replace(/\\u([\d\w]{4})/gi, (match, grp) => {
                    return String.fromCharCode(parseInt(grp, 16));
                });
                return $sce.trustAsHtml(text);
            };
        });
}