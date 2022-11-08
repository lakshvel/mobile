import { HomePage } from "./../home/home";
import { ContactlistPage } from "./../contactlist/contactlist";
import { DeallistPage } from "./../deallist/deallist";
import { Component, ViewChild } from "@angular/core";
import { Intercom } from '@ionic-native/intercom';

import {
  NavController,
  NavParams,
  Nav,
  AlertController,
  MenuController,
  Platform
} from "ionic-angular";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { LocalstorageProvider } from "../../providers/localstorage/localstorage";
import { Upilotconstants } from "../upilotconstant";
import { LoginbackgroundprocessProvider } from "../../providers/loginbackgroundprocess/loginbackgroundprocess";
import { AgendalistPage } from "../agendalist/agendalist";
import { WaitPage } from '../wait/wait';
import {Observable} from 'rxjs';
import { Storage } from "@ionic/storage";
@Component({
  selector: "page-sidemenu",
  templateUrl: "sidemenu.html"
})
export class SidemenuPage {
  rootPage: any;
  pages: Array<{ title: string; component: any }>;
  //To hide the Profile view in side menu
  showsupport: boolean = false;
  //To select lading page menu in side men
  selectedItem = "Contacts";

  @ViewChild(Nav) nav: Nav;

  showloader:boolean=true;
  constructor(
    public authService: AuthServiceProvider,
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private localstorage: LocalstorageProvider,
    public con: Upilotconstants,
    public platform: Platform,
    public loginbackgroundprocess: LoginbackgroundprocessProvider,
    private intercom: Intercom,
    private storage: Storage,
  ) {
    
    /**************  Comment notifications code for beta release for Local Storage  *************/

    // this.con.startBackgroundProcess = navParams.get('startBackgroundProcess');
    // if (this.con.startBackgroundProcess) {
    //   this.loginbackgroundprocess.filterList();
    //  this.loginbackgroundprocess.agendaFilterList();
    //   this.loginbackgroundprocess.getDealsPipelist();
    // }

  /**************  Comment notifications code for beta release  *************/

  }
//Side menu links
  ionViewCanEnter() {
      this.rootPage = WaitPage;
    this.pages = [
      { title: this.con.sidemenuLink.recentlyviewed,component: ContactlistPage},
      { title: this.con.sidemenuLink.contacts, component: ContactlistPage },
      { title: this.con.sidemenuLink.deals, component: DeallistPage },
      { title: this.con.sidemenuLink.agenda, component: AgendalistPage }
    ];

    //To get user profile detail
    this.getProfileData();
        /**************  Comment notifications code for release  *************/

          //  this.scheduleNotification(this.con.contactfiterEndpoint, "428bca");
          //   Observable.interval(2000 * 60).subscribe(x => {
          //     this.localstorage.checkLoginStatus().then(res => {
          //       if (res) {
          //           this.scheduleNotification(this.con.dealfilterEndpoint, "FF0000");
          //       }
          //     });
          //     //TO show alert for a notificaions
          //   });

    /**************  Comment notifications code for  release  *************/

//Local notifications code

    // this.localNotifications.on("click", (notification, state) => {
    //   //alertCtrl.close();
    //   let json = JSON.parse(notification.data);
    //   let alert = this.alertCtrl.create({
    //     title: notification.title,
    //     subTitle: json.mydata
    //   });
    //   alert.present();
    // });
  }

  //Redirect to selected page form side menu
  openPage(page) {
    const body = document.getElementsByTagName("body")[0];
    if (this.hasClass(body, "srch_opn_body")) {
      const ion_content = document.getElementsByClassName("bg_image")[0];
      body.classList.remove("srch_opn_body");
      ion_content.classList.remove("srch_opn");
    }
    this.selectedItem = page.title;
    this.nav.setRoot(page.component, { pagefor: page.title });
    
  }
  //Class checking in body
  hasClass(ele, cls) {
    return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
  }
  //To close the Profile view in side menu
  closemenu() {
    this.showsupport = false;
  }
  //To open side Profile view in side menu
  secondMenu() {
    this.showsupport = true;
  }

  //To logout from application
  logout() {
    this.alertWithoutTitle(this.con.logoutMsg);
  }

  //To show logout confirm alert
  alertWithoutTitle(msg) {
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("poup_remove");
    let alert = this.alertCtrl.create({
      subTitle: msg,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: "Cancel",
          handler: () => {
            body.classList.remove("poup_remove");
          }
        },
        {
          text: "Log out",
          handler: () => {
            this.showsupport = false;
            this.menuCtrl.close();
            body.classList.remove("poup_remove");
            this.unSetlocalStorage();
            this.localstorage.logoutfromlocalstorage();
            this.con.isContactLoaded = false;
            this.con.isDealLoaded = false;
            this.con.cachedContactlistFilterValue = -111;
            this.con.cachedDealsListFilterValue = -111;
            this.con.totalDealValue = '0';
            this.con.currencyDataValue = '';
            this.con.cluster = '';
            this.con.subdomain = '';
            this.storage.clear();
          }
        }
      ]
    });
    alert.present();
  }
  //TO get logged user data
  picture_path: any;
  userData: any;
  getProfileData() {
    var formData = new FormData();
 
    this.authService
      .getPostWithAccessToken("", formData, this.con.meEndpoint)
      .then(
        result => {
          this.showloader=false;
          
          if(result.cluster != undefined && result.cluster != '' && result.cluster != null && result.cluster != 'null') {
            this.con.cluster = result.cluster;
          }
          this.con.subdomain = result.subdomain;
          //console.log(this.userData, "userdata");
          this.localstorage.insertIntoTokenTable(result, this.con.meEndpoint);
          this.userData = result;
          this.picture_path = result.picture_path;
          this.intercomUserRegistraction(this.userData.uid_user);
          this.rootPage = ContactlistPage;
        },
        err => {
          this.showloader=false;
          //console.log(err);
          this.rootPage = HomePage;
        }
      );
  }
  //clearning the logged user data once user logged out
  unSetlocalStorage() {
    this.nav.setRoot(HomePage);
  }

  //Trigger notifications
  scheduleNotification(endpoint, color) {
    let isAndroid = this.platform.is("android");
    this.authService.getData("", endpoint).then(
      result => {
        for (let data of result.data) {
          // this.localNotifications.schedule([
          //   {
          //     id: data.filterViewId,
          //     text: data.filterViewName,
          //     // sound: isAndroid
          //     //   ? "file://assets/sound/notification_andoid.mp3"
          //     //   : "file://assets/notification_ios.m4r",
          //     // data: { mydata: data.filterViewName },
          //     // icon: "file://assets/imgs/logo1.png",
          //     led: "212121",
          //     color: color
          //   }
          // ]);
        }
      },
      err => {
        //console.log(err);
      }
    );
  }

  // Display the Message Composer for intercome
  inercomSupport(){
   
    this.intercom.displayMessageComposer().then(
      res =>{
        //console.log("inercom display ",res);
      }
    ).catch(
      err =>{
        //console.log("inercom display in ERROR ",err);
      }
    );
  }


  // Register the user in intercom
  intercomUserRegistraction(id){
    this.intercom.registerIdentifiedUser({userId: id}).then(
      res =>{
        //console.log("inercom user ",res);
      }
    ).catch(
      err =>{
        //console.log("inercom user in ERROR ",err);
      }
    );
  }
}
