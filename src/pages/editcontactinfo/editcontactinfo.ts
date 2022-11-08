import { ComautosuggestProvider } from './../../providers/comautosuggest/comautosuggest';
import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from "./../../providers/auth-service/auth-service";
import { Upilotconstants } from '../upilotconstant';
import { AutoCompleteComponent } from 'ionic2-auto-complete';

@Component({
  selector: 'page-editcontactinfo',
  templateUrl: 'editcontactinfo.html',
})
export class EditcontactinfoPage {


  protected searchStr: string;
  protected captain: string;

  @ViewChild('nameInputToFocus') nameInputToFocus;
  @ViewChild('addressInputToFocus') addressInputToFocus;
  @ViewChild("phoneFocus") phoneFocus;

  @ViewChild('searchbar')
  searchbar: AutoCompleteComponent;

  infoData: any;
  module: any;
  showloader: boolean = true;
  limitedData: any;
  editName: boolean = false;
  editNameFirstClick: boolean = false;
  editAddress: boolean = false;
  editAddressFirstClick: boolean = false;
  updatePageContent: any;
  pageName:any;

  constructor(
    public autosuggest: ComautosuggestProvider,
    public con: Upilotconstants,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthServiceProvider) {

    this.updatePageContent = this.navParams.get("update");
    this.con.autoCompleteLabel = this.con.autoCompleteLabelCompanyName;
    this.con.searchComEndpoint = this.con.companyAutoCompleteEndpoint;

    this.limitedData = navParams.get('infoData');

    this.module = navParams.get('from');
    
    this.pageName = navParams.get("pageName");
    
    this.getContactInfo('', this.limitedData.id_party)
  }
  countryId: any;
  // To close the Popup
  goBack() {
    this.viewCtrl.dismiss();
  }

  /***Contact data  */


  contactInfo = {
    address: {
      address_lines: '',
      city: '',
      postal_code: '',
      province_state: '',
      id_contact_address: '',
      country: {
        id_country: "0",
        country_name: ''
      }
    },
    phone: {
      id_contact_phone: '',
      phone_no: ''
    },
    email: {
      email_id: '',
      id_contact_email: ''
    },
    company_id: '',
    company_name: '',
    first_name: '',
    last_name: '',
    contact_id: ''
  }

  //To edit contact info
  editContactInfo() {
   //console.log("(this.contactInfo", this.contactInfo);
    var formdata = new FormData();
    if(this.contactInfo.first_name=='' && this.contactInfo.email.email_id !=''){
      
      this.contactInfo.first_name = (this.contactInfo.email.email_id).split('@')[0];
     
    } else if(this.contactInfo.first_name!='' && this.contactInfo.email.email_id==''){
      
    } else if(this.contactInfo.first_name=='' && this.contactInfo.email.email_id=='') {
      if(this.contactInfo.first_name == '') {
        this.con.alertMessage(this.con.firstNameValidaions);
        return false; 
      } else {
        this.con.alertMessage(this.con.emptyEmailValidation);
         return false;
      }
    }
    this.showloader = true;
    if (this.searchbar.getSelection() != null && !(this.searchbar.getSelection() === undefined)
      && this.searchbar.getSelection().hasOwnProperty("id_party")) {
      this.contactInfo.company_id = this.searchbar.getSelection().id_party;
      formdata.append('company_id', this.contactInfo.company_id);
    } else if (this.contactInfo.company_id != null) {
      formdata.append('company_id', this.contactInfo.company_id);
    }
    let value = this.formValidation();
    if (!value && value !== undefined) {
      this.showloader = false;
      return false;
    } else {
      formdata.append('contact_id', this.contactInfo.contact_id);
      if (this.contactInfo.first_name != null) {
        formdata.append('first_name', this.contactInfo.first_name);
      }
      if (this.contactInfo.last_name != null) {
        formdata.append('last_name', this.contactInfo.last_name);
      }
      if (this.contactInfo.email.id_contact_email != null) {
        formdata.append('id_contact_email', this.contactInfo.email.id_contact_email);
      }

      if (this.contactInfo.email.email_id != null) {
        formdata.append('email_id', this.contactInfo.email.email_id);
      }

      if (this.contactInfo.phone.id_contact_phone != null) {
        formdata.append('id_contact_phone', this.contactInfo.phone.id_contact_phone);
      }

      if (this.contactInfo.phone.phone_no != null) {
        formdata.append('phone_no', this.contactInfo.phone.phone_no);
      }
      if (this.contactInfo.address.id_contact_address != null) {
        formdata.append('id_contact_address', this.contactInfo.address.id_contact_address);
      }
      if (this.contactInfo.address.address_lines != null) {
        formdata.append('address_lines', this.contactInfo.address.address_lines);
      }
      if (this.contactInfo.address.city != null) {
        formdata.append('city', this.contactInfo.address.city);
      }
      if (this.contactInfo.address.province_state != null) {
        formdata.append('province_state', this.contactInfo.address.province_state);
      }
      if (this.contactInfo.address.postal_code != null) {
        formdata.append('postal_code', this.contactInfo.address.postal_code);
      }
      if (this.contactInfo.address.country.id_country != "0") {
        formdata.append('id_country', this.contactInfo.address.country.id_country);
      }
      this.authService.getPostWithAccessToken('', formdata, this.con.editContactInfoEndpoint).then(
        result => {
          this.showloader=false;
          if(result.error!==undefined){
            this.con.alertMessage(result.error.msg)
          }
          else{
            this.con.alertMessage(this.con.contactUpdateSuccessMsg);
            this.goBack();
            this.updatePageContent();
          }
        },
        err => {
          this.showloader=false;
        });
    }
  }

  //To get the company info
  getContactInfo(token, companyId) {
    this.showloader = true;
    this.authService.getData(token, this.con.companyOrContactEditDetailsEndpoint + companyId).then(
      result => {
        this.infoData = result
        this.countriesList(token)
        this.contactInfo.first_name = this.infoData.first_name;
        this.contactInfo.last_name = this.infoData.last_name;
        this.contactInfo.contact_id = this.infoData.contact_id;
        //console.log("result.company_id", result.company_id);
        if (result.address.hasOwnProperty("id_contact_address")) {
          this.contactInfo.address = result.address;

          if (result.address.country.id_country == null) {
            this.contactInfo.address.country.id_country = "0";
          }
        }

        if (result.phone.hasOwnProperty("id_contact_phone")) {
          this.contactInfo.phone = result.phone;
        }
        if (result.email.hasOwnProperty("email_id")) {
          this.contactInfo.email = result.email;
        }
        if (result.company_name != '') {
          this.contactInfo.company_name = result.company_name;
        }
        if (result.hasOwnProperty("company_id")) {
          this.contactInfo.company_id = result.company_id;
        }

      }, err => {
        this.showloader = false;
      }
    )
  }
  //to get contries list
  countries: any;
  countriesList(token) {
    this.showloader = true;
    this.authService.getData(token, this.con.countryListEndpoint).then(
      result => {
        this.showloader = false;
        this.countries = result;
        if(this.pageName == 'addphonePopup'){
          setTimeout(() => {
            this.phoneFocus.setFocus();
          }, 300);
        }
      },
      err => {
        this.showloader = false;
      }
    );
  }

  //on click of contat name replace the name into first name and last name
  editContactName() {
    this.editName = true;
    this.editNameFirstClick = true;
    setTimeout(() => {
      this.nameInputToFocus.setFocus();
    }, 200);
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("edit_comp_change");
  }
  // on click of outside converting first name and last name as a sinlge field
  onClickedOutsideName(e: Event) {
    if (this.editNameFirstClick) {
      this.editNameFirstClick = false;
    } else {
      this.editName = !(this.editName);
      const body = document.getElementsByTagName("body")[0];
      body.classList.remove("edit_comp_change");
    }
  }


  //on click of contat address opening the complete address field
  editContactAddress() {
    this.editAddress = true;
    this.editAddressFirstClick = true;
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("edit_comp_change");
  }
  //on click of contat  closing complete address
  onClickedOutsideAddress(e: Event) {
    if (this.editAddressFirstClick) {
      this.editAddressFirstClick = false;
    } else {
      this.editAddress = !(this.editAddress);
      const body = document.getElementsByTagName("body")[0];
      body.classList.remove("edit_comp_change");
    }
  }

//Select the country name based on the country ID
  onSelect(id) {
    for (let data of this.countries.all_countries) {
      if (data.id_country == id) {
        this.contactInfo.address.country.country_name = data.country_name;
        //  break;
      }
    }
  }

  //empty form vaidation
  formValidation() {
    if (this.contactInfo.email.email_id != null && this.contactInfo.email.email_id != '') {
      if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,63})+$/.test(this.contactInfo.email.email_id))) {
        if (this.contactInfo.email.email_id.length > 0) {
          this.con.alertMessage(this.con.emailFormateValidation);
          return false;
        }

      }
    }

    return true;
  }


  getSelection(event) {
    //console.log(event);
  }

}
