///<reference path="wapi.ts"/>

module Ext.Background {
    /**
     * BUG: TypeScript nie pozwala na nadpisanie lib.d.ts
     * Może potem przeniesie się to na chrome.storage.local
     */
    let storage: ILoginData = <ILoginData> localStorage;
    export let user: WAPI.User = loadCachedClient();

    /** Ładowanie klienta z zasobów */
    function loadCachedClient(): WAPI.User {
        let client = new WAPI.Client(
              storage.apiKey
            , storage.apiSecret
        );
        return client.login(storage.userLogin, storage.userKey);
    }

    /**
     * Logowanie użytkownika do wtyczki, wszystko zapisywane do
     * storage i odczytywany z niej podczas logowania
     * @param {ILoginData} data Dane logowania
     */
    export function login(data: ILoginData) {
        _assert(!user, 'Client cannot be logged!');

        (<any>_(storage)).extendOwn(data);
        return user = loadCachedClient();
    }
}