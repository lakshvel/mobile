import { Upilotconstants } from './../upilotconstant';
import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthServiceProvider } from "./../../providers/auth-service/auth-service";
import { Storage } from '@ionic/storage';
import { SidemenuPage } from '../sidemenu/sidemenu';
import { LocalstorageProvider } from '../../providers/localstorage/localstorage';
import { HomePage } from '../home/home';

//declare var dataLayer: Array<any>;

@Component({
  selector: 'page-chooseaccount',
  templateUrl: 'chooseaccount.html',
})
export class ChooseaccountPage {

  constructor(public navCtrl: NavController,
    private storage: Storage,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public authService: AuthServiceProvider,
    public menu: MenuController,
    private localstorage: LocalstorageProvider,
    public con: Upilotconstants
  ) {
    this.menu.enable(false, 'myMenu');//To hide the side menu in accounts page
  }
  accounts = this.navParams.get('accounts');//Get the accounts from Login page

  Loadershow: boolean = false;//To hide the loader while lading in page

  //To login with different accounts if use having multiple accounts
  accountlogin(account) {
    var formData = this.navParams.get('formData');
    formData.append("subdomain", account.subdomain);
    this.con.subdomain = account.subdomain;
    this.con.cluster = account.cluster_nb;
    this.Loadershow = true;
    formData.set('cluster', this.con.cluster);
    this.authService.postData(formData, this.con.loginAuthEndpoint).then(
      result => {

        this.localstorage.getEmailAndSubdomain(this.navParams.get('username'), account).then(
          res => {
             result.cluster = this.con.cluster;
             result.subdomain = this.con.subdomain;
            this.storage.set('token', result);
            this.localstorage.insertIntoTokenTable(result, this.con.loginAuthEndpoint);
            //redirect to the wait page to wait the user for some time
            this.localstorage.insertLoginedinUserData(this.navParams.get('username'), account);
            if (res) {
              this.navCtrl.setRoot(SidemenuPage, { startBackgroundProcess: false });

            } else {
              //Delete all the record 
              this.localstorage.deleteallAllTableRecord();

              //make startBackgroundProcess as false to disable the offline process
              this.navCtrl.setRoot(SidemenuPage, { startBackgroundProcess: true });
            }
          });
      },
      err => {

     
        let redirect = false;
        //console.log(err.error);
        this.validationAlert(err.error.error_description, redirect);
      }
    );

  }
  //While click on cancel button in this page redirecting to login page after Confirm the log out action
  go_back() {
    this.Loadershow = true;
    let redirect = true;
    this.validationAlert(this.con.logoutMsg, redirect);

  }

  //All confirm alert action
  validationAlert(msg, redirect) {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('alert_change');
    let alert = this.alertCtrl.create({
      subTitle: msg,
      enableBackdropDismiss: false,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.Loadershow = false;
          body.classList.remove('alert_change');
          if (redirect == true) {
            this.navCtrl.push(HomePage);
          }
        }
      },
      {
        text: 'Cancel',
        handler: () => {
          this.Loadershow = false;
          body.classList.remove('alert_change');
        }
      }]
    });
    alert.present();
  }
}
