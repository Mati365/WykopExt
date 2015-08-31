/**
 * Created by mateusz on 28.08.15.
 * Skrypty działające w tle, logika aplikacji
 */
///<reference path="wapi.ts"/>

module Ext.Background {
    /** Zasoby aplikacji */
    interface AppStorage extends Storage {
        api: {
            key: string;
            secret: string;
        };
        user: {
            login: string;
            key: string;
        };
    }
    /**
     * BUG: TypeScript nie pozwala na nadpisanie lib.d.ts
     * Może potem przeniesie się to na chrome.storage.local
     */
    let storage: AppStorage = <AppStorage> localStorage;
    export let user: WAPI.User = null;

    /** Ładowanie klienta z zasobów */
    function loadCachedClient() {
        _assert(!user, 'Client cannot be logged!');
        let client = new WAPI.Client(
              storage.api.key
            , storage.api.secret
        );

        /** Logownie się */
        if(!(user = client.login(storage.user.login, storage.user.key)))
            console.log('Nie mogę się zalogować :(');
    }

    /**
     * Logowanie użytkownika do wtyczki, wszystko zapisywane do
     * storage i odczytywany z niej podczas logowania
     * @param {string} apiKey       Klucz aplikacji
     * @param {string} apiSecret    Klucz sekretny
     * @param {string} login        Login użytkownika
     * @param {string} key          Klucz dostępu do konta
     */
    export function login(
          apiKey: string
        , apiSecret: string
        , login: string
        , key: string
    ) {
        (<any>_(storage)).extendOwn({
              api: {
                  key: apiKey
                , secret: apiSecret
            }
            , user: {
                  login: login
                , key: key
            }
        });
        loadCachedClient();
    }
}