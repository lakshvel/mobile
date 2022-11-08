import { ComautosuggestProvider } from './../../providers/comautosuggest/comautosuggest';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ContacttabsPage } from '../contacttabs/contacttabs';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { Upilotconstants } from "../upilotconstant";
import { ServiceProvider } from "../../providers/service/service";
import { AutoCompleteComponent } from 'ionic2-auto-complete';

@Component({
  selector: 'page-contactcreated',
  templateUrl: 'contactcreated.html',
})
export class ContactcreatedPage {
  //This page used to display the newly added contact detais or company details from api

  @ViewChild('nameInputToFocus') nameInputToFocus;
  @ViewChild('addressInputToFocus') addressInputToFocus;

  @ViewChild('searchbar')
  searchbar: AutoCompleteComponent;

  contactData: any;
  showName: boolean = false;
  showloader: boolean = true;
  countries: any;
  editName: boolean = false;
  editNameFirstClick: boolean = false;
  editAddress: boolean = false;
  editAddressFirstClick: boolean = false;
  showContact: boolean = false;

  constructor(
    public autosuggest: ComautosuggestProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public authService: AuthServiceProvider,
    public con: Upilotconstants,
    public service: ServiceProvider) {

    this.con.autoCompleteLabel = this.con.autoCompleteLabelCompanyName;
    this.con.searchComEndpoint = this.con.companyAutoCompleteEndpoint;

  }
countryId: any;
  ngOnInit() {
    this.contactData = this.navParams.get('contactOrCompanyDetails');
    //console.log("this.contactData", this.contactData);
    // //console.log("this.contactData.address", this.contactData.address.province_state);
    // //console.log("this.contactData.address", this.contactData.address.country.id_country);
    // //console.log("this.contactData.address", this.contactData.address.country.country_name);
    // //console.log("this.contactData.address", this.contactData.address);
    if (this.contactData.address != "") {
      this.showContact = true;
    }
  }


  ionViewDidLoad() {
    // //console.log('Hii');
    this.countriesList();
    this.openContact()
  }
  //to get the country list
  countriesList() {
    this.showloader = true;
    this.authService.getData('', this.con.countryListEndpoint).then(
      result => {
        this.showloader = false;
        //console.log(result);
        this.countries = result;
        this.con.updateListPageContent();
      },
      err => {
        this.showloader = false;
        //console.log(err);
      }
    );
  }
  //Close the modal
  close_modal() {
    this.viewCtrl.dismiss();
  }
  //TO open Contact
  openContact() {

    this.contactData.id_party = this.contactData.contact_id;
    this.service.setLimitData(this.contactData);
    //console.log("this.contactData ", this.contactData);
    this.navCtrl.push(ContacttabsPage, { openTab: 'info', isCreated: true });
    this.viewCtrl.dismiss();
  }

  openName() {
    this.showName = true;
  }

   //show the first name and last name input field on click of contact name
  editContactName() {
    this.editName = true;
    this.editNameFirstClick = true;
    setTimeout(() => {
      this.nameInputToFocus.setFocus();
    }, 200);
  }

  // hide the first name and last name input field on click of outside contact field 
  onClickedOutsideName(e: Event) {

    if (this.editNameFirstClick) {
      this.editNameFirstClick = false;
    } else {
      this.editName = !(this.editName);
    }
  }

  //show all address input field on click of address field
  editContactAddress() {
    this.editAddress = true;
    this.editAddressFirstClick = true;
    setTimeout(() => {
      this.addressInputToFocus.setFocus();
    }, 200);
  }

  // hide all address input field on click of outside address field 
  onClickedOutsideAddress(e: Event) {
    if (this.editAddressFirstClick) {
      this.editAddressFirstClick = false;
    } else {
      this.editAddress = !(this.editAddress);
    }
  }


  getSelection(event) {
    //console.log(event);
  }

  //Select the country name based on the country ID
  onSelect(id) {
    for (let data of this.countries.all_countries) {
      if (data.id_country == id) {
        this.contactData.address.country.country_name = data.country_name;
        //  break;
      }
    }
  }

}
