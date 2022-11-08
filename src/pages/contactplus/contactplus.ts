import { AddnotePage } from './../addnote/addnote';
import { Component, HostListener } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';
import { AddnewcontactorcompanyPage } from '../addnewcontactorcompany/addnewcontactorcompany';
import { ContactorcompanycallPage } from '../contactorcompanycall/contactorcompanycall';
import { ServiceProvider } from './../../providers/service/service';
import { AddstakeholderPage } from '../addstakeholder/addstakeholder';
import { DealcallPage } from '../dealcall/dealcall';
import { Upilotconstants } from './../upilotconstant';
import { EditcontactinfoPage } from './../editcontactinfo/editcontactinfo';
import { EditcompanyinfoPage } from '../editcompanyinfo/editcompanyinfo';
import { TasktypelistPage } from '../tasktypelist/tasktypelist';
import { CreatetaskPage } from '../createtask/createtask';
import { AddnewdealPage } from '../addnewdeal/addnewdeal';

@Component({
  selector: 'page-contactplus',
  templateUrl: 'contactplus.html',
})
export class ContactplusPage {

  isCompany: any;
  from: any;
  showCompany: boolean = true;
  removeBlurBody: boolean = true;
  showStakeholder: boolean;
  updatePageContent: any;
  companydata: any;
  addnotedata: boolean = true;
  id:any;
  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {

  }
  constructor(
    public service: ServiceProvider,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public con: Upilotconstants) {
    this.updatePageContent = navParams.get('update');
    this.isCompany = navParams.get('isCompany');
    // //console.log("this.isCompany", this.isCompany);
    this.id = navParams.get('id');
    //console.log("contactplusid", this.id);
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('blur_pop_up');
    this.from = navParams.get('from');
    if (this.from == 'contact') {
      let contactCompanyDetails = service.getErrorForContactCompanyEmpty();
      if (contactCompanyDetails === null) {
        this.showCompany = false;
        this.companydata = true;
        // this.addnotedata = true;
      }
    } else if (this.from == 'deals') {
      this.showCompany = false;
      this.addnotedata = true;
      this.companydata = false;
      this.isCompany = false;
      // this.showStakeholder = navParams.get('showStakeholder');
    }


  }


  ionViewWillLeave() {
    if (this.removeBlurBody) {
      this.removeBodyBlurClass();
    }
  }

  // To close the Popup
  goBack() {
    this.removeBodyBlurClass();
    // this.location.back();

  }

  // To close the Popup
  openAddNotePage() {
    this.removeBlurBody = false;
    const profileModal = this.modalCtrl.create(AddnotePage, { from:this.from,update: this.updatePageContent.bind(this) }, { cssClass: "modal_exapn_tab" });
    profileModal.present();
    this.viewCtrl.dismiss();

  }

  // To close the Popup
  goAddCompany() {
    this.viewCtrl.dismiss();
  }
  //Add new company
  addNewCompany() {
    let emailOrWebsite = {
      'website': '',
      'id' : this.id
    };
    const profileModal = this.modalCtrl.create(AddnewcontactorcompanyPage, { emailOrWebsite: emailOrWebsite, isContact: false }, { cssClass: "modal_exapn_tab" });
    profileModal.present();
    this.removeBodyBlurClass();
  }

  //Add new Contact
  addNewContact() {
    let emailOrWebsite = {
      'email': '',
      'id' : this.id
    };
    const profileModal = this.modalCtrl.create(AddnewcontactorcompanyPage, { emailOrWebsite: emailOrWebsite, isContact: true }, { cssClass: "modal_exapn_tab" });
    profileModal.present();
    this.removeBodyBlurClass();
  }
  //Open contact details
  callContactOrCompany(to) {
    if (to != 'deals') {
      var contactOrCompanyCallDetails = this.service.getInfoData();
      if (!contactOrCompanyCallDetails.phones) {
        this.removeBodyBlurClass();
        this.noContacts(to);
      } else if (contactOrCompanyCallDetails.phones.length == 0) {
        this.removeBodyBlurClass();
        this.noContacts(to);
      } else {
        const profileModal = this.modalCtrl.create(ContactorcompanycallPage, { from: to,update: this.updatePageContent.bind(this) }, { cssClass: "modal_exapn_tab" });
        profileModal.present();
        this.removeBodyBlurClass();
      }
    } else {
      var dealCallDetails = this.service.getInfoData();
      if (!dealCallDetails.party.phones) {
        this.removeBodyBlurClass();
        this.noContacts(to);
      } else if (dealCallDetails.party.phones.length == 0) {
        this.removeBodyBlurClass();
        this.noContacts(to);
      } else {
        const profileModal = this.modalCtrl.create(DealcallPage, { cssClass: "modal_exapan_tab" });
        profileModal.present();
        this.removeBodyBlurClass();
      }
    }

  }
  //on click of the call icon if company have one phone numbers.
  noContacts(value: any) {
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("alert_change");
    let alert = this.alertCtrl.create({
      message: this.con.noContact,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            body.classList.remove("alert_change");
          }
        },
        {
          text: 'Add one',
          handler: () => {
            if (value == 'contact' || value == 'company') {
              this.editContactInfo(value);
            }
            body.classList.remove("alert_change");
          }
        }
      ]
    });
    alert.present();
  }

  //To redirect to company edit info page
  editContactInfo(value: any) {
    //check for internate connection
    if (this.con.isConnected) {
      var infoData = this.service.getInfoData();
      if (value == 'contact') {
        const profileModal = this.modalCtrl.create(
          EditcontactinfoPage,
          { infoData: infoData, from: "company",pageName:'addphonePopup',update: this.updatePageContent.bind(this) },
          { cssClass: "modal_exapn_tab" }
        );
        profileModal.present();
      } else {
        const profileModal = this.modalCtrl.create(
          EditcompanyinfoPage,
          { infoData: infoData, from: "company",pageName:'addphonePopup',update: this.updatePageContent.bind(this) },
          { cssClass: "modal_exapn_tab" }
        );
        profileModal.present();
      }
    } else {
      //show no internate connection alert
      this.con.alertMessage(this.con.noInternateConnectionMsg);
    }
  }

  //Remove the blur class  from body after closing the modal
  removeBodyBlurClass() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('blur_pop_up');
    this.viewCtrl.dismiss();
  }
  //To add Stake holder
  addStakeHolder() {
    const profileModal = this.modalCtrl.create(AddstakeholderPage, { update: this.updatePageContent.bind(this) }, { cssClass: "modal_exapn_tab" });
    profileModal.present();
    this.removeBodyBlurClass();
  }
  //Add a followup task
  addFollowup(){
    const profileModal = this.modalCtrl.create(TasktypelistPage, {from:'sechdule',tabPage:this.from }, { cssClass: "modal_exapn_tab" });
    profileModal.present();
    this.removeBodyBlurClass();
  }
  //add a log task
  addLogTask(){
    const profileModal = this.modalCtrl.create(CreatetaskPage, {from:'log',tabPage:this.from }, { cssClass: "modal_exapn_tab" });
    profileModal.present();
    this.removeBodyBlurClass();
  }

  //Add new Deal
  addNewDeal() {
    let emailOrWebsite = {
      'email': ''
    };
    const profileModal = this.modalCtrl.create(AddnewdealPage, { emailOrWebsite: emailOrWebsite, isContact: true }, { cssClass: "modal_exapn_tab" });
    // //console.log("profileModal", profileModal);
    profileModal.present();
    this.removeBodyBlurClass();
  }

}
