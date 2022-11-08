import { Component } from "@angular/core";
import { NavParams, ViewController, ModalController } from "ionic-angular";
import { Upilotconstants } from "../upilotconstant";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ContactcreatedPage } from "../contactcreated/contactcreated";
import { ServiceProvider } from "./../../providers/service/service";
import { ContactexistsPage } from "../contactexists/contactexists";
import { CompanycreatedPage } from "../companycreated/companycreated";

//declare var dataLayer: Array<any>;

@Component({
  selector: "page-addnewcontactorcompany",
  templateUrl: "addnewcontactorcompany.html"
})
export class AddnewcontactorcompanyPage {
  //To display the Contact/Company
  isContact: boolean;

  //Show Loader
  showLoader: boolean = false;

  //Hilight the input field is not validated
  errorClass: boolean = false;
  contactOrCompanyCreateApiResponse: any;
  isEmailFocus: boolean = false;
  //Adding new contact
  emailOrWebsite: any;
  constructor(
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public service: ServiceProvider,
    public con: Upilotconstants
  ) {
    //check  it is contact or company
    this.isContact = navParams.get("isContact");
    this.emailOrWebsite = navParams.get("emailOrWebsite");
  }

  // To close the Popup
  goBack() {
    this.viewCtrl.dismiss();
  }
  //Adding new contact
  addNewContact() {
    //console.log(this.emailOrWebsite.email);
    this.emailValidation(this.emailOrWebsite.email);
  }
  //Adding new company
  addNewCompany() {
    //console.log(this.emailOrWebsite.website);
    if (this.emailOrWebsite.website.length == 0) {
      this.errorClass = true;
      this.con.alertMessage(this.con.companyURL);
      return false;
    }
    //Check website  validation
    if (
      !/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,63}[\.]{0,1}/.test(
        this.emailOrWebsite.website
      )
    ) {
      this.con.alertMessage(this.con.companyValidURL);
      this.errorClass = true;
      return false;
    }
    this.errorClass = false;

    var formData = new FormData();
    formData.append("website", this.emailOrWebsite.website);
    formData.append("contact_id", this.emailOrWebsite.id);
    //Calling api for Company details
    this.callApi(formData, this.con.createcompanyEndpoint, CompanycreatedPage); 
  }

  //Email Validation
  emailValidation(email) {
    //check empty validation
    if (email.length == 0) {
      this.errorClass = true;
      this.con.alertMessage(this.con.emptyEmailValidation);
      return false;
    } else {
      //check envalid email validation
      if (!this.con.emailValidation(email)) {
        this.errorClass = true;
        this.con.alertMessage(this.con.invalidEmailFormat);
        return false;
      }
    }
    //Email validation end
    var formData = new FormData();
    formData.append("email", this.emailOrWebsite.email);
    formData.append("company_id", this.emailOrWebsite.id);
    formData.append("force", "false");
    this.callApi(formData, this.con.createContactEndpoint, ContactcreatedPage); //Calling api to get Contact details.
  }



  //Calling the API to create company and contact
  callApi(formData, type, redirect) {
    this.showLoader = true;
    this.authService.getPostWithAccessToken('', formData, type).then(
      result => {
        this.showLoader = false;
        this.contactOrCompanyCreateApiResponse = result;
        // if the contract or company succesfully created
        if (this.contactOrCompanyCreateApiResponse.error === undefined) {
          //console.log("API result", result);
          this.service.setLimitData(result);
          //open contact detail page
          const profileModal = this.modalCtrl.create(
            redirect,
            { contactOrCompanyDetails: this.contactOrCompanyCreateApiResponse },
            { cssClass: "modal_exapn_tab" }
          );
          profileModal.present();
          this.viewCtrl.dismiss();
        }
        //if conntact email exists
        else if (this.contactOrCompanyCreateApiResponse.error.type !== undefined &&
          this.contactOrCompanyCreateApiResponse.error.type == 'contact_email_exists') {
          this.service.setLimitData(result.error.contact);
          const profileModal = this.modalCtrl.create(ContactexistsPage,
            {}, { cssClass: "modal_cont_ex_outer", enableBackdropDismiss: false });
          profileModal.present();

        }
        else if (this.contactOrCompanyCreateApiResponse.error.msg !== undefined) {
          this.con.alertMessage(this.contactOrCompanyCreateApiResponse.error.msg);
          //this.viewCtrl.dismiss();
        }

      },
      err => {
        //console.log("err ", err);
        this.showLoader = false;
      }
    );
  }


  checkEmailBlur() {
    this.isEmailFocus = false;
  }

  checkEmailFocus() {
    this.isEmailFocus = true;
  }
}
