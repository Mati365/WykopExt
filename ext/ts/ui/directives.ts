module Ext.UI {
    /** Otwieranie nowych linków w nowych zakładkach */
    export class ExtHref implements ng.IDirective {
        constructor(
            public background: Background
        ) {}
        public link: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: any) => {
            $(element)
                .attr('href', 'javascript:;')
                .click(() => {
                    this.background.api.browserApi.openTab(attrs.extHref);
                });
        };

        static factory(): ng.IDirectiveFactory { return (background) => new ExtHref(background); }
    }

    /** Wyświetlanie innego obrazu w razie błędu */
    export class ErrSrc implements ng.IDirective {
        public link: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: any) => {
            element.bind('error', () => {
                attrs.src != attrs.errSrc && attrs.$set('src', attrs.errSrc);
            });
        };

        static factory(): ng.IDirectiveFactory { return () => new ErrSrc; }
    }

    /** Tryb nightmode */
    export class NightMode implements ng.IDirective {
        public link: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery) => {
            new Date().getHours() >= 20 && element.addClass('night-mode');
        };

        static factory(): ng.IDirectiveFactory { return () => new NightMode(); }
    }

    mod
        .directive('extHref', ExtHref.factory())
        .directive('errSrc', ErrSrc.factory())
        .directive('nightMode', NightMode.factory());
}