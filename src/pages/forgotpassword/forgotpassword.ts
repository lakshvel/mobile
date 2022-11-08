import { Component, Renderer2 } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { AuthServiceProvider } from "./../../providers/auth-service/auth-service";
import { HomePage } from '../home/home';
import { Upilotconstants } from '../upilotconstant';
@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {

  showwhiteSubDomain: boolean = false;//To show the subdomain input field white while typining

  showwhiteUserName: boolean = false;//To show the UserName input field white while typining

  domain_eamil = this.navParam.get('email');//Get the username from login page
  constructor(
    private renderer: Renderer2,
    public navCtrl: NavController,
    private navParam: NavParams,
    public authService: AuthServiceProvider,
    private alertCtrl: AlertController,
    public menu: MenuController,
  public constant : Upilotconstants) {
    this.menu.enable(false, 'myMenu');//To hide the side menu in Forgot password page
    this.initializeItems();
    if (this.domain_eamil.length > 0) {
      this.showwhiteUserName = true;
    }
  }
  Loadershow: boolean = false;//To hide the loader while lading in page




  subdomain = '';
  //To fill the sub domain if user have only accont
  initializeItems() {
    let formData = new FormData();
    formData.append('email_address', this.navParam.get('email'));
    this.authService.postData(formData, "autofill-forgot-password").then(
      result => {
        this.subdomain = result.domainName;
        if (this.subdomain.length > 0) {
          this.showwhiteSubDomain = true;
        }
      },
      err => {
        //console.log(err);
      });
  }

  //To fill the sub domain
  password = {
    doamin_com: ".upilot.com",
    username: this.domain_eamil,
    failure: ''
  };


  errorclass = 0;
  //To reset Password calling api
  resetpassword() {
    var formData = new FormData();
    formData.append("email_address", this.password.username);
    formData.append("subdomain", this.subdomain);

    if (this.subdomain == '' && this.password.username == '') {
      this.errorclass = 3;
      this.validationAlert(this.constant.forgotPasswordUsernameSubdomainMsg);
      return false;
    }

    else if (this.subdomain == '') {
      this.errorclass = 1;
      this.validationAlert(this.constant.forgotPasswordSubdomainMsg);
      return false;
    }
    else if (this.password.username == '') {
      this.errorclass = 2;
      this.validationAlert(this.constant.forgotPaswordUsernameMsg);
      return false;
    }
    else {
        if (!this.constant.emailValidation(this.password.username)) {
        this.errorclass = 1;
        this.validationAlert(this.constant.invalidEmailFormat);
        return false;
      }
      this.Loadershow = true;
      this.authService.postData(formData, "forgot-password").then(
        result => {
          //console.log(result);
          this.navCtrl.push(HomePage, { 'success': 'true' });
          this.renderer.addClass(document.body, 'log_succs');
        },
        err => {
          var json = err.error;
          if (err.status == 0) {
            this.validationAlert(json.error_description);
          } else if (json.error == "forbidden") {
            this.validationAlert(json.error_description);
          }
          else {
            this.validationAlert("Subdomain and username not matched");
          }
          return false;
        }
      );
    }
  }
  //Go back to Login page
  go_back() {
    this.navCtrl.push(HomePage);
  }
  //All  alert action
  validationAlert(msg) {
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
        }
      }]
    });
    alert.present();
  }
  //TO show the white back  ground for input fields
  onFocusEvent(data, field) {
    var temp = false;
    //console.log(data.length);
    if (data.length > 0) {
      temp = true;
    }
    if (field == 'username') {
      this.showwhiteUserName = temp;
    } else {
      this.showwhiteSubDomain = temp;
    }
  }
}
