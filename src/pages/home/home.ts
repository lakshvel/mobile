import { Upilotconstants } from "./../upilotconstant";
import { SidemenuPage } from "./../sidemenu/sidemenu";
import { Component } from "@angular/core";
import {
  NavController,
  Nav,
  AlertController,
  NavParams,
  MenuController
} from "ionic-angular";

import { AuthServiceProvider } from "./../../providers/auth-service/auth-service";

import { ForgotpasswordPage } from "../forgotpassword/forgotpassword";
import { ChooseaccountPage } from "../chooseaccount/chooseaccount";
import { Globals } from "../../global";

import { Storage } from "@ionic/storage";
import { LocalstorageProvider } from "../../providers/localstorage/localstorage";

//declare var dataLayer: Array<any>;

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  showLink: boolean = false;
  Loadershow: boolean = false;
  showwhiteUserName: boolean = false;
  showwhitePassword: boolean = false;
  internetConnectionCheck: boolean;
  constructor(
    private storage: Storage,
    private globals: Globals,
    public navCtrl: NavController,
    public authService: AuthServiceProvider,
    public NavParams: NavParams,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public nav: Nav,
    private localstorage: LocalstorageProvider,
    public constant: Upilotconstants
  ) {
    this.menu.enable(false, "myMenu");
    this.internetConnectionCheck = this.constant.isConnected;
  }

  ionViewDidLoad() {
    this.authService.postData({}, this.constant.emptyString).then(result => { }, err => { });
  }
  loginData = {
    username: "",
    password: "",
    success: this.NavParams.get("success"),
    failure: this.NavParams.get("fail")
  };
  errorclass = this.constant.ZERO;

  //To call the login api
  login() {
    if (
      this.loginData.username == this.constant.emptyString &&
      this.loginData.password == this.constant.emptyString
    ) {
      this.errorclass = this.constant.THREE;
      this.alertWithoutTitle(this.constant.emptyValidationforLogin);
      return false;
    }
    if (this.loginData.username == this.constant.emptyString) {
      this.errorclass = this.constant.ONE;
      this.alertWithoutTitle(this.constant.emptyEmailValidation);
      return false;
    }
    if (this.loginData.password == "") {
      this.errorclass = this.constant.TWO;
      this.alertWithoutTitle(this.constant.emptyPasswordValidation);
      return false;
    }
    this.errorclass = this.constant.ZERO;
    console.log('email test->'+/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,63})+$/.test(
        this.loginData.username));
    if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,63})+$/.test(
        this.loginData.username
      )
    ) {
    } else {
      this.errorclass = this.constant.ONE;
      this.alertWithoutTitle(this.constant.invalidEmailFormat);
      return false;
    }
    this.Loadershow = true;
    var formData = new FormData();
    formData.append(this.constant.grantType, this.globals.grantType);
    formData.append(this.constant.clientId, this.globals.clientId);
    formData.append(this.constant.clientSecret, this.globals.clientSecret);
    formData.append(this.constant.username, this.loginData.username);
    formData.append(this.constant.password, this.loginData.password);
    formData.append('cluster', this.constant.cluster);


    this.authService.postData(formData, this.constant.loginAuthEndpoint).then(
      result => {
        result.cluster = this.constant.cluster;
        result.subdomain = this.constant.subdomain;
        this.storage.set("token", result);
        console.log('token:-'+result);

        this.localstorage
          .getEmailAndSubdomain(this.loginData.username, "")
          .then(res => {
            this.localstorage.insertIntoTokenTable(
              result,
              this.constant.loginAuthEndpoint
            );
            //insert the loginuser details
            this.localstorage.insertLoginedinUserData(
              this.loginData.username,
              ""
            );
            if (res) {
              this.navCtrl.setRoot(SidemenuPage, { startBackgroundProcess: false });
            } else {

              this.localstorage.deleteallAllTableRecord();

              //make startBackgroundProcess as false to disable the offline process
              this.navCtrl.setRoot(SidemenuPage, { startBackgroundProcess: true });
            }
          });
      },
      err => {

        var json = err.error;
        if (err.status == this.constant.ZERO) {
          const content = document.getElementsByTagName("ion-content")[0];
          content.classList.add("fr_pass_lnk");
          this.alertWithoutTitle("Please check network connection and try again");
        } else if (json.error == this.constant.multipleAccounts) {
          this.Loadershow = false;
          let accounts = json.accounts;
          this.navCtrl.push(ChooseaccountPage, {
            accounts: accounts,
            formData: formData,
            username: this.loginData.username
          });
        } else if (json.error == 'cluster') {
          this.Loadershow = false;
          let accounts = json.accounts;
          this.constant.cluster = json.accounts[0].cluster_nb;
        //  formData['cluster'] = this.constant.cluster;
          console.log(this.constant.cluster, json.accounts[0], formData, 'new tasks  lkfjadskljf')
            if(accounts.length > 1) {
            this.navCtrl.push(ChooseaccountPage, {
              accounts: accounts,
              formData: formData,
              username: this.loginData.username
            });
          } else {
    formData.append("subdomain", json.accounts[0].subdomain);
    formData.set('cluster', json.accounts[0].cluster_nb);
    this.constant.subdomain = json.accounts[0].subdomain;
    this.Loadershow = true;
    this.authService.postData(formData, this.constant.loginAuthEndpoint).then(
      result => {

        this.localstorage.getEmailAndSubdomain(this.loginData.username, json.accounts[0].subdomain).then(
          res => {
             result.cluster = this.constant.cluster;
             result.subdomain = this.constant.subdomain;
            this.storage.set('token', result);
            this.localstorage.insertIntoTokenTable(result, this.constant.loginAuthEndpoint);
            //redirect to the wait page to wait the user for some time
            this.localstorage.insertLoginedinUserData(this.loginData.username, json.accounts[0].subdomain);
            if (res) {
              this.navCtrl.setRoot(SidemenuPage, { startBackgroundProcess: false });

            } else {
              //Delete all the record 
              this.localstorage.deleteallAllTableRecord();

              //make startBackgroundProcess as false to disable the offline process
              this.navCtrl.setRoot(SidemenuPage, { startBackgroundProcess: true });
            }
          });
          });
        }
        } else {
          this.showLink = true;
          const content = document.getElementsByTagName("ion-content")[0];
          content.classList.add("fr_pass_lnk");
          this.alertWithoutTitle(json.error_description);
        }
      }
    );
  }
  //Display alert with  title in the Alert
  presentAlert(msg) {
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("alert_change");
    let alert = this.alertCtrl.create({
      subTitle: msg,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: "OK",
          handler: () => {
            this.Loadershow = false;
            body.classList.remove("alert_change");
          }
        }
      ]
    });
    alert.present();
  }
 
  //Display alert without  title in the Alert
  alertWithoutTitle(msg) {
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("alert_change");
    let alert = this.alertCtrl.create({
      subTitle: msg,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: "OK",
          handler: () => {
            this.Loadershow = false;
            body.classList.remove("alert_change");
          }
        }
      ]
    });
    alert.present();
  }

  //Navigate to the forgot page with login data
  goToOtherPage() {
    this.navCtrl.push(ForgotpasswordPage, { email: this.loginData.username });
  }


  // On focus of password field enable the Forgot Passowrd Link
  onFocusEvent(data, field) {
    var temp = false;
    console.log(data.length);
    if (data.length > this.constant.ZERO) {
      temp = true;
    }
    if (field == "username") {
      this.showwhiteUserName = temp;
    } else {
      this.showwhitePassword = temp;
    }
  }

  //On focus out of email field check the email validation
  emailValidation(email) {
    console.log(email.length);
    if (this.constant.emailValidation(email)) {
    } else if (email.length > this.constant.ZERO) {
      this.errorclass = this.constant.ONE;
      this.presentAlert(this.constant.invalidEmailFormat);
      return false;
    } else if (email.length == this.constant.ZERO) {
      this.errorclass = this.constant.ONE;
      this.presentAlert(this.constant.emptyEmailValidation);
      return false;
    }
  }
}
