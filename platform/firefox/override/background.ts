///<reference path="../../../ext/ts/background/background.ts"/>

module Ext.Background {
    /** API pod konkretną przeglądarkę */
    declare let self: any;
    browserApi = {
        Badge: {
              setText: (text: string) => { self.port.emit('set-badge-text', text); }
            , setColor: (color: string) => { self.port.emit('set-badge-color', color); }
        }
    };
}