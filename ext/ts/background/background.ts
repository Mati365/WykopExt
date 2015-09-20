///<reference path="../../defs/chrome/chrome.d.ts"/>
///<reference path="wapi.ts"/>
///<reference path="parser.ts"/>

module Ext.Background {
    export let browserApi: BrowserAPI = null;

    /**
     * BUG: TypeScript nie pozwala na nadpisanie lib.d.ts
     * Może potem przeniesie się to na chrome.storage.local
     */
    let storage: LoginData = <LoginData> localStorage;
    let intervals: { [index: string]: number } = {};
    export let user: CoreAppUser = loadCachedClient();

    /** Pobieranie powiadomień funkcją bo export zapisuje jako assoc */
    export let notifyCount = 0
             , tagsCount   = 0;

    /**
     * Liczenie powiadomień, w zależności od
     * parzystości pokazywane są określone powiadomienia
     * Gdy jest parzyste pokazuje powiadomienia z wykopaliska
     * a gdy nie pokazuje hashtagi o ile są
     */
    function updateBadge(tags: boolean = false) {
        var limit = (number: number, limit: number) => {
            return number >= limit ? (limit.toString() + '+') : number;
        };

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
                let text = notifyCount
                        ? limit(notifyCount, 99) + (tagsCount ? ' #+':'')
                        : (tagsCount ? ('#' + limit(tagsCount, notifyCount ? 9 : 999)) : '');
                if(browserApi) {
                    browserApi.Badge.setText(text.trim());
                    browserApi.Badge.setColor(!notifyCount ? '#0000FF' : '#FF0000');
                }
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
        if(_.isEmpty(storage))
            return;

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
            initInterval('notify', () => {
                updateBadge(true);
                updateBadge(false);
            }, storage.apiMode ? 6000 : 22000);
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
        browserApi && browserApi.Badge.setText('');
    }
}