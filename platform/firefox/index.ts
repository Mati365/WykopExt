/** Dymek */
let data = require('sdk/self').data;
let panel = require('sdk/panel').Panel({
      contentURL: data.url('popups/popup.html')
    , contentScriptFile: [
          data.url('../bower_components/jquery/dist/jquery.min.js')
        , data.url('../bower_components/cryptojslib/rollups/md5.js')
        , data.url('../bower_components/cryptojslib/components/md5-min.js')
        , data.url('../bower_components/underscore/underscore-min.js')
        , data.url('../js/background.js')
    ]
    , onHide: hidePopup
    , onMessage: function(message) {
        console.log(message);
    }
    , width: 280
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