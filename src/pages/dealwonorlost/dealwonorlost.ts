import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Upilotconstants } from '../upilotconstant';


@Component({
  selector: 'page-dealwonorlost',
  templateUrl: 'dealwonorlost.html',
})
export class DealwonorlostPage {
  updatePageContent: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public authservice: AuthServiceProvider,
    public constant: Upilotconstants, ) {
    this.updatePageContent = navParams.get('update');

  }
  dealWonOrLOst: boolean;
  showloader: boolean = false;;
  lostReasonList: any;
  optionsValue = '';
  name = '';
  dealDataName:any;
  ionViewDidLoad() {
    this.dealWonOrLOst = this.navParams.get('dealWonOrLOst');
    // //console.log("this.dealWonOrLOst ",this.dealWonOrLOst);
    if (!this.dealWonOrLOst) {
      this.lostReasonListAPI();
    } else {
      const body = document.getElementsByTagName('body')[0];
      body.classList.add('blur_pop_up');
      // deal_name
      this.dealDataName = this.constant.dealName;
      // //console.log("this.constant.dealName", this.constant.dealName);
    }
  }
  //To go back form modal
  goBack() {
    this.removeBodyBlurClass();
  }
  //reason to lost a deal api
  lostReasonListAPI() {
    this.showloader = true;
    this.authservice.getData('', this.constant.dealLostReason).then(
      result => {
        this.showloader = false;
        this.lostReasonList = result.data;
      }, err => {
        this.showloader = false;
      }
    )
  }
  //To update the status of the lost deal
  dealLostStatus() {
    this.showloader = true;
    let formData = new FormData();
    formData.append('id_deal', this.constant.dealID);
    formData.append('status', 'lost');
    formData.append('id_reason', this.optionsValue);
    formData.append('text_note', this.name)
    this.authservice.getPostWithAccessToken(this.constant.dealID, formData, this.constant.changeDealStatus).then(
      result => {
        this.showloader = false;
          //this.constant.alertMessage(this.constant.DealUpdatePending);
        this.viewCtrl.dismiss();
        this.updatePageContent();
      }, err => {
         this.showloader=false;
      });
  }
  //Removing the blur class while leaving the page
  removeBodyBlurClass() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('blur_pop_up');
    this.viewCtrl.dismiss();
    this.updatePageContent();
  }
}
