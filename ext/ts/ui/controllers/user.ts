///<reference path="../../shared.ts"/>
///<reference path="../interfaces.ts"/>
///<reference path="../popup.ts"/>

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
            this.setCategory(
                <any> !background.api.notifyCount && <any> background.api.tagsCount
            );
        }

        /** Pobieranie powiadomień */
        private loadNotifications() {
            /** w background jest asynchronicznie i może się nie zalogować */
            if(!this.background.user) {
                setTimeout(this.loadNotifications.bind(this), 500);
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


    /** Otwieranie nowych linków w nowych zakładkach */
    export class ExtHref implements ng.IDirective {
        public restrict: string = 'A';
        public link: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: any) => {
            $(element)
                .attr('href', attrs.extHref)
                .click(() => {
                    chrome.tabs.create({ url: attrs.extHref });
                });
        };

        static factory(): ng.IDirectiveFactory { return () => new ExtHref; }
    }

    /** Wyświetlanie innego obrazu w razie błędu */
    export class ErrSrc implements ng.IDirective {
        public restrict: string = 'A';
        public link: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: any) => {
            element.bind('error', () => {
                attrs.src != attrs.errSrc && attrs.$set('src', attrs.errSrc);
            });
        };

        static factory(): ng.IDirectiveFactory { return () => new ErrSrc; }
    }
    mod
        .controller('UserCtrl', UserCtrl)
        .directive('extHref', ExtHref.factory())
        .directive('errSrc', ErrSrc.factory())
        .filter('trusted', function($sce){
            return text => {
                try {
                    text = JSON.parse('"' + text + '"')
                } catch(err) {}
                return $sce.trustAsHtml(text);
            };
        });
}