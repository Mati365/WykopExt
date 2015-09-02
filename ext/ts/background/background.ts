///<reference path="../../defs/chrome/chrome.d.ts"/>
///<reference path="wapi.ts"/>

module Ext.Background {
    /**
     * BUG: TypeScript nie pozwala na nadpisanie lib.d.ts
     * Może potem przeniesie się to na chrome.storage.local
     */
    let storage: LoginData = <LoginData> localStorage;
    export let user: WAPI.User = loadCachedClient();

    /**
     * Liczenie powiadomień, w zależności od
     * parzystości pokazywane są określone powiadomienia
     * Gdy jest parzyste pokazuje powiadomienia z wykopaliska
     * a gdy nie pokazuje hashtagi o ile są
     */
    let odd = false;
    function updateBadge() {
        user
            .Notifications[(odd = !odd) ? 'getTagsCount' : 'getCount']()
            .done(data => {
                if(!data.count)
                    return;
                chrome.browserAction.setBadgeText({
                    text: !data.count && !odd
                        ? ''
                        : ((odd ? '#' : '') + (data.count > 10 ? '10+' : data.count))
                });
                chrome.browserAction.setBadgeBackgroundColor({
                    color: odd ? '#FF0000' : '#0000FF'
                });
            });
    }
    setInterval(() => {
        user && updateBadge();
    }, 11000);

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
     * @param {LoginData} data Dane logowania
     */
    export function login(data: LoginData) {
        WAPI._assert(!user, 'Client cannot be logged!');

        (<any>_(storage)).extendOwn(data);
        return user = loadCachedClient();
    }
}