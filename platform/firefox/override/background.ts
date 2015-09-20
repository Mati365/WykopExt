///<reference path="../../../ext/ts/background/background.ts"/>
///<reference path="../../../ext/ts/ui/defs.ts"/>

module Ext.Background {
    /** API pod firefoxa jest złączone z content script */
    declare let self: any;
    declare module Ext.UI {
        export var mod: ng.IModule;
    }
    browserApi = {
          openTab: (url: string) => { self.port.emit('open-tab', url); }
        , Badge: {
              setText: (text: string) => { self.port.emit('set-badge-text', text); }
            , setColor: (color: string) => { self.port.emit('set-badge-color', color); }
        }
    };

    /** Broadcast nie działa */
    self.port.on('reload-page', () => {
        $(document).trigger('reload-notifications');
    });
}