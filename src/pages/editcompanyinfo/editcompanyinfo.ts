import { Component, ViewChild } from "@angular/core";
import { NavController, ViewController, NavParams, AlertController } from "ionic-angular";
import { AuthServiceProvider } from "./../../providers/auth-service/auth-service";
import { Upilotconstants } from "../upilotconstant";
@Component({
  selector: "page-editcompanyinfo",
  templateUrl: "editcompanyinfo.html"
})
export class EditcompanyinfoPage {
  @ViewChild("addressInputToFocus") addressInputToFocus;
  @ViewChild("phoneFocus") phoneFocus;
  infoData: any;
  limitedData: any;
  showloader: boolean = true;
  countryId: any;
  changeComImage: boolean = true;
  editAddress: boolean = false;
  editAddressFirstClick: boolean = false;
  updatePageContent: any;
  pageName:any;
  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public alertCtrl: AlertController,
    public con: Upilotconstants
  ) {
    //get company data from service
    this.updatePageContent = navParams.get('update');
    this.limitedData = navParams.get("infoData");
    this.pageName = navParams.get("pageName");
    this.getCompanyInfo('', this.limitedData.id_party);
  }

  // To close the Popup
  goBack() {
    this.viewCtrl.dismiss();
  }

  //Edit the company info
  editCompanyInfo() {
    var formdata = new FormData();
    let value = this.formValidation();
    if (!value && value !== undefined) {
     
      return false;
    } else {
      if(this.conpanyInfo.company_name==''){
        this.con.alertMessage(this.con.companyNameValidation);
        return false;
      }
      this.showloader = true;
      formdata.append("company_id", this.conpanyInfo.company_id);
      formdata.append("company_name", this.conpanyInfo.company_name);
      if (this.conpanyInfo.website.id_contact_website != null) {
        formdata.append("id_contact_website", this.conpanyInfo.website.id_contact_website);
      }
      if (this.conpanyInfo.website.website_url != null) {
        formdata.append("website_url", this.conpanyInfo.website.website_url);
      }
      if (this.conpanyInfo.email.id_contact_email != null) {
        formdata.append("id_contact_email", this.conpanyInfo.email.id_contact_email);
      }
      if (this.conpanyInfo.email.email_id != null) {
        formdata.append("email_id", this.conpanyInfo.email.email_id);
      }
      if (this.conpanyInfo.phone.id_contact_phone != null) {
        formdata.append("id_contact_phone", this.conpanyInfo.phone.id_contact_phone);
      }
      if (this.conpanyInfo.phone.phone_no != null) {
        formdata.append("phone_no", this.conpanyInfo.phone.phone_no);
      }
      if (this.conpanyInfo.address.id_contact_address != null) {
        formdata.append(
          "id_contact_address",
          this.conpanyInfo.address.id_contact_address
        );
      }
      if (this.conpanyInfo.address.address_lines != null) {
        formdata.append("address_lines", this.conpanyInfo.address.address_lines);
      }
      if (this.conpanyInfo.address.city != null) {
        formdata.append("city", this.conpanyInfo.address.city);
      }
      if (this.conpanyInfo.address.province_state != null) {
        formdata.append("province_state", this.conpanyInfo.address.province_state);
      }
      if (this.conpanyInfo.address.postal_code != null) {
        formdata.append("postal_code", this.conpanyInfo.address.postal_code);
      }
      if (this.conpanyInfo.country.id_country != null) {
        formdata.append("id_country", this.conpanyInfo.country.id_country);
      }

      //console.log(formdata);
      this.authService
        .getPostWithAccessToken(
        '',
        formdata,
        this.con.editCompanyInfoEndpoint
        )
        .then(
        result => {
          this.showloader=false;
          //console.log(result.error);
          if(result.error!==undefined){
            this.con.alertMessage(result.error.msg)
          }
          else{
            this.con.alertMessage(this.con.companyUpdateSuccessMsg);
            this.goBack();
            this.updatePageContent();
          }
        },
        err => {
          this.showloader=false;
        }
        );
    }


  }

  //empty company data
  conpanyInfo = {
    address: {
      address_lines: '',
      city: '',
      postal_code: '',
      province_state: '',
      id_contact_address: ''
    },
    country: {
      id_country: '',
      country_name: ''
    },
    phone: {
      id_contact_phone: '',
      phone_no: ''
    },
    website: {
      id_contact_website: '',
      website_url: ''
    },
    email: {
      email_id: '',
      id_contact_email: ''
    },
    company_id: '',
    company_name: '',



  }
  //To get the company info
  getCompanyInfo(token, companyId) {
    this.showloader = true;
    this.authService.getData(token, this.con.companyOrContactEditDetailsEndpoint + companyId).then(
      result => {
        this.infoData = result;
        this.countriesList(token);
        this.conpanyInfo.company_id = result.company_id;
        this.conpanyInfo.company_name = result.company_name;
        if (result.address.hasOwnProperty("id_contact_address")) {
          this.conpanyInfo.address = result.address;
        }
        if (result.address.hasOwnProperty("country")) {
          this.conpanyInfo.country = result.address.country;
        }
        if (result.phone.hasOwnProperty("id_contact_phone")) {
          this.conpanyInfo.phone = result.phone;
        }
        if (result.website.hasOwnProperty("id_contact_website")) {
          this.conpanyInfo.website = result.website;
        }
        if (result.email.hasOwnProperty("email_id")) {
          this.conpanyInfo.email = result.email;
        }

      },
      err => {
        this.showloader = false;
        //console.log(err);
      }
    );
  }
  //to get contries list
  countries: any;
  countriesList(token) {
  //  this.showloader = true;
    this.authService.getData(token, this.con.countryListEndpoint).then(
      result => {
        this.showloader = false;
        //console.log("this.pageName ",this.pageName);
        this.countries = result;
        if(this.pageName == 'addphonePopup'){
          setTimeout(() => {
            this.phoneFocus.setFocus();
          }, 300);
        }

      },
      err => {
        this.showloader = false;
        //console.log(err);
      }
    );
  }
  //All alerts
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
            this.showloader = false;
            body.classList.remove("alert_change");
          }
        }
      ]
    });
    alert.present();
  }
  //on click of  address opening the complete address field
  editCompanyAddress() {
    this.editAddress = true;
    this.editAddressFirstClick = true;
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("edit_comp_change");
  }
  //on click of complete address opening the address field
  onClickedOutsideAddress(e: Event) {

    if (this.editAddressFirstClick) {
      this.editAddressFirstClick = false;
    } else {
      this.editAddress = !this.editAddress;
      const body = document.getElementsByTagName("body")[0];
      body.classList.remove("edit_comp_change");
    }
  }
  //adding a class to body while focus of the company name
  focusFunction() {
    this.changeComImage = false;
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("edit_comp_change");
  }
  //removing a class to body while focusout of the company name
  focusOutFunction() {
    //console.log("Focus Out:");
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("edit_comp_change");
    this.changeComImage = true;
  }
  //empty form validations
  formValidation() {
    if (this.conpanyInfo.email.email_id != null && this.conpanyInfo.email.email_id != '') {
      if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,63})+$/.test(this.conpanyInfo.email.email_id))) {
        if (this.conpanyInfo.email.email_id.length > 0) {
          this.con.alertMessage(this.con.emailFormateValidation);
          return false;
        }

      }
    }
    if (this.conpanyInfo.website.website_url != null && this.conpanyInfo.website.website_url != '') {
      if (!/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,63}[\.]{0,1}/.test(this.conpanyInfo.website.website_url)) {
        this.con.alertMessage(this.con.companyValidURL);
        return false;
      }
    }
    return true;
  }
}
