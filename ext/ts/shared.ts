/**
 * Created by mateusz on 30.08.15.
 * Kod współdzielony przez popup
 */
///<reference path="../defs/jquery/jquery.d.ts"/>

module Ext {
    /** Format z python'a */
    String.prototype['format'] = function(...params: any[]): string {
        return this.replace(/\{(\w*)\}/g, (match, val) => {
            return isNaN(val) ? params[0][val] : params[val];
        });
    };

    /**
     * Aseracja, rzucanie wyjątkiem jeśli nie jest spełnione
     * @param {any}     condition Warunek
     * @param {boolean} message   Wiadomość w wyjątku
     */
    export function _assert(condition: any, message: string) {
        if(!condition)
            throw new Error(message);
    }
}