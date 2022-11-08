import { AddnewcontactorcompanyPage } from './../addnewcontactorcompany/addnewcontactorcompany';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-contactorcontactlink',
  templateUrl: 'contactorcontactlink.html',
})
export class ContactorcontactlinkPage {

  constructor(
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }



  // To close the Modal
  goBack() {
    this.viewCtrl.dismiss();
  }

  //To redirect to add new Contact page
  addNewContact() {
    let emailOrWebsite = {
      'email': '',
      'id':''
    };
    const profileModal = this.modalCtrl.create(AddnewcontactorcompanyPage, { emailOrWebsite: emailOrWebsite, isContact: true }, { cssClass: "modal_exapn_tab" });
    profileModal.present();
    this.viewCtrl.dismiss();
  }

  //To redirect to add new Company page
  addNewCompany() {
    let emailOrWebsite = {
      'website': '',
      'id':''
    };
    const profileModal = this.modalCtrl.create(AddnewcontactorcompanyPage, { emailOrWebsite: emailOrWebsite, isContact: false }, { cssClass: "modal_exapn_tab" });
    profileModal.present();
    this.viewCtrl.dismiss();
  }

}
