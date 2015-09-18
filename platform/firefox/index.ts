/** Dymek */
let data = require('sdk/self').data;
let panel = require('sdk/panel').Panel({
      contentURL: data.url('popups/popup.html')
    , contentScriptFile: [
        /** Background script z chrome */
          data.url('../bower_components/jquery/dist/jquery.min.js')
        , data.url('../bower_components/cryptojslib/rollups/md5.js')
        , data.url('../bower_components/cryptojslib/components/md5-min.js')
        , data.url('../bower_components/underscore/underscore-min.js')
        , data.url('../js/background.js')

        /** Popup script z chrome */
        , data.url('../bower_components/angular/angular.js')
        , data.url('../bower_components/angular-route/angular-route.js')
        , data.url('../bower_components/is_js/is.js')
        , data.url('../js/popup.js')
    ]
    , onHide: hidePopup
    , width: 280
    , height: 350
});

/** Przycisk */
let button = require('sdk/ui/button/toggle').ToggleButton({
      id: 'wykopext-popup'
    , label: 'Otwórz powiadomienia'
    , icon: {
          '16': './icon.png'
        , '32': './icon.png'
        , '64': './icon.png'
    }
    , onChange: showPopup
});

/** Akcje przycisku */
function showPopup(state: { checked: boolean }) {
    if(state.checked)
        panel.show({
            position: button
        });
}
function hidePopup() {
    button.state('window', { checked: false });
}