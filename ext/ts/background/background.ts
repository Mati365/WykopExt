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
    let notifyCount = 0
      , tagsCount = 0;
    function updateBadge(tags: boolean = false) {
        if(!user)
            return;

        /** Pobieranie */
        chrome.browserAction.setBadgeBackgroundColor({
            color: '#FF0000'
        });
        user
            .Notifications[tags ? 'getTagsCount' : 'getCount']()
            .done(data => {
                if(tags)
                    tagsCount = data.count;
                else
                    notifyCount = data.count;

                /** Aktualizacja badge */
                chrome.browserAction.setBadgeText({
                    text:     (notifyCount ? notifyCount : '')
                            + (tagsCount ? ' #' + (tagsCount > 99 ? '99+' : tagsCount) : '')
                });

                /** Pokazywanie komentarzu tylko do wpisu */
                if(!tags && data.count > notifyCount)
                    chrome.notifications.create('WykopExt - powiadomienie', <chrome.notifications.NotificationOptions> {
                          type: 'basic'
                        , title: 'Powiadomienia'
                        , message: 'Masz nieprzeczytanie powiadomienia!'
                    }, null);
            });
    }

    /** Tagi są mniej ważne */
    setInterval(updateBadge.bind(window, false), 22000);
    setInterval(updateBadge.bind(window, true), 60000);

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
    export let logout = localStorage.clear.bind(localStorage);
}