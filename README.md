## Ionic Beacon

Reference implementation based on the article Support iBeacons In Your Ionic Framework Mobile App (https://www.thepolyglotdeveloper.com/2015/09/support-ibeacons-in-your-ionic-framework-mobile-app/).

You have to make some changes in this code for your specific needs (for instance, the beacon region name and the beacon UUID in the app.js file).

Ths code was tested on iOS 10.

### Beacon configuration

This code is not for beacon configuration. To configure the beacons, you'll need specific software (for instance: iBKS Config Tool app for iOS or Android). Check with your beacon provider how to properly make the configuration.

### Ionic View App Not Supported

####Update Oct, 03 2016:

- This code doesn't work on Ionic View App (http://view.ionic.io/) since Ionic View doesn't yet support ng-Cordova Beacon Plugin (http://ngcordova.com/docs/plugins/beacon/).
- For a complete list of Ionic View supported ng-Cordova plugins, see http://blog.petehouston.com/2016/01/21/list-of-supported-cordova-plugins-in-ionic-view/.
- If you want the Ionic Team to support ng-Cordova Beacon Plugin, make your request it in this issue: https://github.com/driftyco/ionic-view-issues/issues/15#issuecomment-250482824.
