import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { ComautosuggestProvider } from './../../providers/comautosuggest/comautosuggest';
import { Upilotconstants } from '../../pages/upilotconstant';
import { AutoCompleteComponent } from 'ionic2-auto-complete';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-addstakeholder',
  templateUrl: 'addstakeholder.html',
})
export class AddstakeholderPage {

  @ViewChild('nameInputToFocus') nameInputToFocus;

  //Local varibles
  stakeholderList: number;
  stakeholderName = {
    'name': '',
  }
  ChooseRole = '';
  showloader: boolean = false;
  showWhite: boolean = false;
  isContactSelected: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public service: ServiceProvider,
    public viewCtrl: ViewController,
    public autosuggest: ComautosuggestProvider,
    public constant: Upilotconstants,
    public authService: AuthServiceProvider) {
    this.updatePageContent = navParams.get('update');
    this.constant.autoCompleteLabel = "name";
    this.constant.searchComEndpoint = "contact/search-contact-company";
  }
  updatePageContent: any;
  autoCompletedValue: any;
  ionViewDidLoad() {
    this.stakeholderList = this.service.getStakeholderList();
  }
  //closing modal
  goBack() {
    this.viewCtrl.dismiss();
  }
  changeComImage: boolean = false;
  errorClass: boolean = false;
  //Adding a stakeholder for a deal
  addStakeholder() {
    let shk_id = '';
    let dealId = this.constant.dealID;

    var formData = new FormData();
    if (this.stakeholderName.name == '' || this.autoCompletedValue === undefined) {
      this.constant.alertMessage(this.constant.addCompanyname);
      this.errorClass = true;
      return false;
    }
    if (this.ChooseRole === undefined || this.ChooseRole == '') {
      this.constant.alertMessage(this.constant.addStakeholderRole);
      this.errorClass = true;
      return false;
    }
    this.showloader = true;
    this.errorClass = false;
    if (this.autoCompletedValue != null && !(this.autoCompletedValue === undefined)
      && this.autoCompletedValue.hasOwnProperty("id_party")) {
      shk_id = this.autoCompletedValue.id_party;

    }

    formData.append('id_deal', dealId);
    formData.append('id_stakeholder', this.ChooseRole);
    formData.append('id_party', shk_id);
    this.authService.getPostWithAccessToken('', formData, this.constant.addStakeHolder).then(
      result => {
        this.showloader = false;
        this.updatePageContent();
        this.constant.alertMessage(this.constant.addStakeHolderSucessMsg);
        this.goBack();
      },
      err => {
        this.showloader = false;
      });
  }
  //On focus of the company field adding a class to body
  focusFunction() {
    this.changeComImage = false;
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("edit_comp_change");
  }
  //On focus out of the company field removing  class to body
  focusOutFunction() {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("edit_comp_change");

    this.changeComImage = true;
  }
  //Add a class to body on click of company name input field
  addCompanyName() {
    this.showWhite = true;
    setTimeout(() => {
      this.nameInputToFocus.setFocus();
    }, 200);
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("edit_comp_change");
  }

  // on click of outside removing the body class
  onClickedOutsideName(e: Event) {
    if (this.showWhite) {
      this.showWhite = false;
      const body = document.getElementsByTagName("body")[0];
      body.classList.remove("edit_comp_change");
    }

  }
  selectedContact: any;
  // Gettin the selected comapny id from auto complete 
  getSelection(event) {
    this.autoCompletedValue = event;
    this.isContactSelected = true;
    this.selectedContact = event;
  }
  //geting the first letter of the first name and last name
  notificationNameNoimage: any;
  nameSpace(name) {
    let format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    if (name) {
      let sliceName = name.split(" ");
      if (sliceName.length <= 1) {
        this.notificationNameNoimage = sliceName[0].slice(0, 1);
      } else {
        if (sliceName[1].match(format)) {
          this.notificationNameNoimage = sliceName[0].slice(0, 1);
        } else {
          this.notificationNameNoimage = sliceName[0].slice(0, 1) + sliceName[1].slice(0, 1);
        }
      }
      return this.notificationNameNoimage;
    }
  }
}
