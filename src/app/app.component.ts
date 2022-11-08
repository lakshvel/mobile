// Importing libraries required for the app initialization
import { Upilotconstants } from './../pages/upilotconstant'
import { LocalstorageProvider } from './../providers/localstorage/localstorage'
import { ImgcacheService } from './../global/services/cache-img/cache-img.service'
import { SidemenuPage } from './../pages/sidemenu/sidemenu'
import { Component, ViewChild } from '@angular/core'
import { Platform, Nav } from 'ionic-angular'
import { SplashScreen } from '@ionic-native/splash-screen'
import { HomePage } from '../pages/home/home'
import { Network } from '@ionic-native/network'
import { AlertController } from 'ionic-angular/components/alert/alert-controller'
import { Observable } from 'rxjs/Rx'
import { Keyboard } from '@ionic-native/keyboard'
import { StatusBar } from '@ionic-native/status-bar'

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage: any

  @ViewChild('nav') nav: Nav
  @ViewChild('alertCtrl') alertCtrl: AlertController

  constructor(
    imgcacheService: ImgcacheService,
    private localstorage: LocalstorageProvider,
    private network: Network,
    private constant: Upilotconstants,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private keyboard: Keyboard,
    private statusBar: StatusBar
  ) {
    this.platform.ready().then(() => {
      // watch network for a disconnect
      this.checkInternetConnection()
      Observable.interval(1000 * 1).subscribe((x) => {
        this.checkInternetConnection()
        //TO show alert for a notificaions
      })

      //To show the done button in ios  and hiding the keyboard access bar
      //this.keyboard.hideKeyboardAccessoryBar(false);

      //return true if device is android
      constant.isAndroidPlatform = platform.is('android')

      //return true if device is ios
      constant.isIOSPlatform = platform.is('ios')

      //return true if device is ipad
      constant.isIPadPlatform = platform.is('ipad')

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault();
      // let status bar overlay webview
      this.statusBar.overlaysWebView(false)

      ////console.log(cordova.platformId, 'platformid')
      // if(cordova.platformId == 'android') {
      //   // set status bar to Black
      //   this.statusBar.backgroundColorByHexString("#000000");
      // } else {
      //   // set status bar to Black
      //   this.statusBar.backgroundColorByHexString("#000000");
      // }
      this.statusBar.backgroundColorByName('black')

      //hide the splash screen
      this.splashScreen.hide()

      //Create all the table stcruture for the local database - Sqlite
      this.localstorage.createAllTable()

      var _windowVar = this.platform.win()

      var _platform = _windowVar['device']['platform']
      var _devVersion = _windowVar['device']['version']

      //To store the images locally
      if (_platform != 'Android' && _devVersion != '11') {
        imgcacheService.initImgCache().then(() => {
          //To redirect to Contacts page if user loged in and try to open the app second time
          this.localstorage
            .checkLoginStatus()
            .then((res) => {
              if (res) {
                //redirect Sidemenu Page
                this.rootPage = SidemenuPage
              } else {
                this.rootPage = HomePage
              }
              this.nav.setRoot(this.rootPage)
            })
            .catch((err) => {
              ////console.log("err" + err);
            })
        })
      } else {
        //To redirect to Contacts page if user loged in and try to open the app second time
        this.localstorage
          .checkLoginStatus()
          .then((res) => {
            if (res) {
              //redirect Sidemenu Page
              this.rootPage = SidemenuPage
            } else {
              this.rootPage = HomePage
            }
            this.nav.setRoot(this.rootPage)
          })
          .catch((err) => {
            ////console.log("err" + err);
          })
      }
    })
  }

  // Check Internet Connection
  checkInternetConnection() {
    this.network.onDisconnect().subscribe(() => {
      this.constant.isConnected = false
    })

    // Watch network for a connection
    this.network.onConnect().subscribe(() => {
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      this.constant.isConnected = true
    })
  }
}
