import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { AddnewdealPage } from '../addnewdeal/addnewdeal';
import { TasktypelistPage } from '../tasktypelist/tasktypelist';
import { CreatetaskPage } from '../createtask/createtask';
import { ContactorcontactlinkPage } from '../contactorcontactlink/contactorcontactlink';
import { Upilotconstants } from '../upilotconstant';

@Component({
  selector: 'page-contactordealcreatelink',
  templateUrl: 'contactordealcreatelink.html',
})
export class ContactordealcreatelinkPage {

  removeBlurBody: boolean = true;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public con: Upilotconstants) {
  }
//This is the method when view loaded
  ionViewDidLoad() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('blur_pop_up');
  }
 //This method triggers when page leaving
  ionViewWillLeave() {
    if (this.removeBlurBody) {
      this.removeBodyBlurClass();
    }
  }
  //to go back
  goBack() {
    this.removeBodyBlurClass();
  }

  //Remove the blur class  from body after closing the modal
  removeBodyBlurClass() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('blur_pop_up');
    this.viewCtrl.dismiss();
  }


  //To show the modal for add new contact or new company
  addNewContact() {
    //check for internate connection
    if (this.con.isConnected) {
      const profileModal = this.modalCtrl.create(ContactorcontactlinkPage, {}, { cssClass: "modal_exapn_tab" });
      profileModal.present();
    //  this.removeBodyBlurClass();
    } else {
      //show no internate connection alert
      this.con.alertMessage(this.con.noInternateConnectionMsg);
    }
  }

  //Add new Contact
  addNewDeal() {
    let emailOrWebsite = {
      'email': ''
    };
    const profileModal = this.modalCtrl.create(AddnewdealPage, { emailOrWebsite: emailOrWebsite, isContact: true }, { cssClass: "modal_exapn_tab" });
    profileModal.present();
    this.removeBodyBlurClass();
  }
  //To create a follow up task
  addFollowups() {
    const profileModal = this.modalCtrl.create(TasktypelistPage, {from:'sechdule'}, { cssClass: "modal_exapn_tab" });
    profileModal.present();
    this.removeBodyBlurClass();
  }
  //To create a log task
  addLogTasks() {
    const profileModal = this.modalCtrl.create(CreatetaskPage, { from: 'log' }, { cssClass: "modal_exapn_tab" });
    profileModal.present();
    this.removeBodyBlurClass();
  }
}
