///<reference path="../../defs/chrome/chrome.d.ts"/>
///<reference path="wapi.ts"/>
///<reference path="parser.ts"/>

module Ext.Background {
    export interface BrowserAPI {
        Badge: {
              setText: (text: string) => BrowserAPI
            , setColor: (color: string) => BrowserAPI
        }
    }
    export let browserApi: BrowserAPI = null;

    /**
     * BUG: TypeScript nie pozwala na nadpisanie lib.d.ts
     * Może potem przeniesie się to na chrome.storage.local
     */
    let storage: LoginData = <LoginData> localStorage;
    let intervals: { [index: string]: number } = {};
    export let user: CoreAppUser = loadCachedClient();

    /**
     * Liczenie powiadomień, w zależności od
     * parzystości pokazywane są określone powiadomienia
     * Gdy jest parzyste pokazuje powiadomienia z wykopaliska
     * a gdy nie pokazuje hashtagi o ile są
     */
    export let notifyCount = 0
             , tagsCount   = 0;
    function updateBadge(tags: boolean = false) {
        /** Pobieranie */
        user
            .Notifications[tags ? 'getTagsCount' : 'getCount']()
            .done(data => {
                let count = parseInt(data.count || data);
                if(tags)
                    tagsCount = count;
                else
                    notifyCount = count;

                /** Aktualizacja badge */
                let text = (notifyCount ? notifyCount : '')
                         + (tagsCount ? ' #' + (tagsCount > 9 ? '9+' : tagsCount) : '');
                if(browserApi) {
                    browserApi
                        .Badge.setText(text.trim())
                        .Badge.setColor(!notifyCount ? '#0000FF' : '#FF0000')
                }

                ///** Pokazywanie komentarzu tylko do wpisu */
                //if(!tags && count > notifyCount)
                //    chrome.notifications.create('WykopExt - powiadomienie', <chrome.notifications.NotificationOptions> {
                //          type: 'basic'
                //        , title: 'Powiadomienia'
                //        , message: 'Masz nieprzeczytanie powiadomienia!'
                //    }, null);
            });
    }

    /** Zarządzanie intervalami */
    export function initInterval(id: string, func: () => void, delay: number) {
        intervals[id] && clearInterval(intervals[id]);
        intervals[id] = setInterval(func, delay);
    }
    function stopIntervals() {
        _(intervals).each(<any> clearInterval);
    }

    /**
     * Ładowanie użytkownika z zasobów, w zależności od
     * trybu aplikacji wczytuje określone meody
     */
    function loadCachedClient(): CoreAppUser {
        let user: CoreAppUser = null;
        if(<any> storage.apiMode === 'false')
            user = new Parser.User();
        else {
            let client = new WAPI.Client(
                  storage.apiKey
                , storage.apiSecret
            );
            user = client.login(storage.userLogin, storage.userKey);
        }
        if(user) {
            stopIntervals();
            initInterval('notify', updateBadge.bind(window, false), storage.apiMode ? 6000 : 22000);
            initInterval('tags', updateBadge.bind(window, true), storage.apiMode ? 10000 : 60000);
        }
        return user;
    }

    /**
     * Ustawianie trybu API, wymagane zalogowanie respektowanie ilości
     * @param {boolean} apiMode Tryb API pobiera wszystko z serwera API
     */
    export function setApiMode(apiMode: boolean = false) {
        return !(storage.apiMode = apiMode)
                ? false
                : (user = loadCachedClient());
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

    /** Wylogowywanie się */
    export function logout() {
        storage.clear();
        user = null;
        chrome.browserAction.setBadgeText({
            text: ''
        });
    }
}