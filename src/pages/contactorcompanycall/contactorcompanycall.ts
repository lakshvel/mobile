import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { ServiceProvider } from './../../providers/service/service';
import { AddnotePage } from '../addnote/addnote';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'page-contactorcompanycall',
  templateUrl: 'contactorcompanycall.html',
})
export class ContactorcompanycallPage {
  contactOrComapnyCallDetails: any;
  contactAccordin: boolean = true;
  companyAccordin: boolean = false;
  getContactCompanyDetail: any;
  contactCompanyDetails: any;
  from: any;
  loadHtml: boolean = false;
  dataPresent: any;
  updatePageContent: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private service: ServiceProvider,private callNumber: CallNumber,
    public modalCtrl: ModalController) {

    this.updatePageContent = navParams.get('update');
  }
  //this method will stop the html unstill data renders
  ionViewCanEnter() {
    this.from = this.navParams.get('from');
    if (this.from == 'contact') {
      this.contactOrComapnyCallDetails = this.service.getInfoData();
      this.dataPresent = this.service.getContactDetail();
      if (this.dataPresent.info.first_name === undefined) {

      } else {
        this.loadHtml = true;
        this.contactCompanyDetails = this.dataPresent.info;
      }
    } else {
      this.loadHtml = true;
      this.companyAccordin = true;
      let dataPresent = this.service.getInfoData();
      this.contactCompanyDetails = dataPresent;
      this.contactCompanyDetails = this.contactCompanyDetails;
    }
  }

  //To dismiss the modal
  goBack() {
    this.viewCtrl.dismiss();
  }
  //To get the accordin
  toggleSectionCall(contactOrCompany, event) {
    if (contactOrCompany == "contact") {
      if (this.contactAccordin == true) {
        this.contactAccordin = false;
      } else {
        this.contactAccordin = true;
      }
    }
    else if (contactOrCompany == "company") {
      if (this.companyAccordin == false) {
        this.companyAccordin = true;
      } else {
        this.companyAccordin = false;
      }
    }
  }
  //To check accordin open or close
  hasClass(ele, cls) {
    return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
  }
  //to open add note page
  openNote(phone) {
    this.callNumber.callNumber(phone, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));


    const body = document.getElementsByTagName('body')[0];
    body.classList.add('blur_pop_up');

    const profileModal = this.modalCtrl.create(AddnotePage, {keyboardopen:'Yes', update: this.updatePageContent.bind(this) }, { cssClass: "modal_exapn_tab" });
    profileModal.present();
  }
}
