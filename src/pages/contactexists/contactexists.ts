import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { ServiceProvider } from './../../providers/service/service';
import { ContacttabsPage } from '../contacttabs/contacttabs';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ContactcreatedPage } from '../contactcreated/contactcreated';
import { Upilotconstants } from "../upilotconstant";

@Component({
  selector: 'page-contactexists',
  templateUrl: 'contactexists.html',
})
export class ContactexistsPage {
  contactDetails: any;
  showLoader: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public service: ServiceProvider,
    public authService: AuthServiceProvider,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public con: Upilotconstants
  ) {
    this.contactDetails = service.getLimitData();//Get the contact exists data from service
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("ad_nw_con_pop");
  }
  //To open exists contact tab page
  openContact() {
    this.viewCtrl.dismiss();
    this.navCtrl.push(ContacttabsPage);
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("ad_nw_con_pop");
    
  }
  //creating contact even contact exists
  createContact() {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("ad_nw_con_pop");
    this.showLoader = true;
    var formData = new FormData();
    formData.append('email', this.contactDetails.email);
    formData.append('force', 'true');
    this.authService.getPostWithAccessToken('', formData, this.con.createContactEndpoint).then(
      result => {
        this.service.setLimitData(result);
        const profileModal = this.modalCtrl.create(ContactcreatedPage, { contactOrCompanyDetails: result, isCompany: false }, { cssClass: "modal_exapn_tab" });
        profileModal.present();
        this.viewCtrl.dismiss();
      }, err => {
        this.showLoader = false;
      }
    );
  }

}
