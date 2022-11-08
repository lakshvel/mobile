import { Component } from "@angular/core";

import {
  NavParams,
  ViewController,
  ModalController,
  AlertController
} from "ionic-angular";

import { ServiceProvider } from "./../../providers/service/service";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { Upilotconstants } from "../upilotconstant";
import { DealwonorlostPage } from "../dealwonorlost/dealwonorlost";

@Component({
  selector: "page-changedealstatus",
  templateUrl: "changedealstatus.html"
})
export class ChangedealstatusPage {
  selectedStage: any;
  stagesSummary: any;
  dealStatus: any;
  removeBlurBody: boolean = true;

  showloader: boolean = false;
  updatePageContent: any;

  constructor(
    public service: ServiceProvider,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public authservice: AuthServiceProvider,
    public constant: Upilotconstants,
    public alertCtrl: AlertController
  ) {
    this.updatePageContent = navParams.get("update");
    this.selectedStage = navParams.get("selectedStage");
    this.stagesSummary = navParams.get("stagesSummary");
    this.dealStatus = navParams.get("dealStatus");
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("blur_pop_up");
  }

  //Runs when the page is about to leave and no longer be the active page.
  ionViewWillLeave() {
    if (this.removeBlurBody) {
      this.removeBodyBlurClass();
    }
  }

  // To close the Popup
  goBack() {
    this.removeBodyBlurClass();
  }

  //Remove the blur class  from body after closing the modal
  removeBodyBlurClass() {
    this.viewCtrl.dismiss();
    this.removeBlurBody = false;
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("blur_pop_up");
  }
  //To update deal status
  updateDealStatus(action, value) {
    this.showloader = true;
    let formData = new FormData();
    formData.append("id_deal", this.constant.dealID);
    formData.append("status", value);
    if (value == "won" || value == "pending") {
      this.authservice
        .getPostWithAccessToken(
          this.constant.dealID,
          formData,
          this.constant.changeDealStatus
        )
        .then(
          result => {
            this.showloader = false;
              if (value == "won") {
                this.openmodal(true, "dl_cat_main_pop");
              } else {
                //this.constant.alertMessage(this.constant.dealReopenedSuccessfully);
                this.viewCtrl.dismiss();
                this.updatePageContent();
              }
            
          },
          err => {
             this.showloader=false;
          }
        );
    } else if (value == "lost") {
      this.showloader = false;
      this.openmodal(false, "modal_exapn_tab");
      this.viewCtrl.dismiss();
    }
  }
  //call to update status from pending
  updateDealPendingStatus(value) {
    //console.log('val->'+value);
    //console.log('this-dealStatus->'+this.dealStatus);
    this.showloader = true;
    if (this.dealStatus == "pending") {
      this.statusUpdate(value);
    } else {
      this.alertWithoutTitle(
        'This deal already "' +
          this.dealStatus +
          '" do you want to update the stage',
        value
      );
    }
  }
  //update the deal status
  statusUpdate(value) {
    this.showloader = true;
    //console.log('statusUpdate');
    let formData = new FormData();
    formData.append("id_deal", this.constant.dealID);
    formData.append("id_pipeline_stage", value);
    this.authservice
      .getPostWithAccessToken(
        this.constant.dealID,
        formData,
        this.constant.updateDealStatus
      )
      .then(
        result => {
          //console.log('statusUpdate result->'+result);
          this.showloader = false;
          //this.constant.alertMessage(this.constant.DealUpdatePending);
          this.viewCtrl.dismiss();
          this.updatePageContent();
        },
        err => {
          //console.log('statusUpdate result->'+err);
          this.showloader=false;
        }
      );
  }
  //open the modal to show deal success message and to change deal lost status
  openmodal(dealWonOrLOst, modalCLass) {
    const wonlostopen = this.modalCtrl.create(
      DealwonorlostPage,
      {
        dealWonOrLOst: dealWonOrLOst,
        update: this.updatePageContent.bind(this)
      },
      { cssClass: modalCLass }
    );
    wonlostopen.present();
  }
  alertWithoutTitle(msg, value) {
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("alert_change");
    let alert = this.alertCtrl.create({
      subTitle: msg,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: "Cancel",
          handler: () => {
            body.classList.remove("alert_change");
            this.showloader = false;
          }
        },
        {
          text: "OK",
          handler: () => {
            body.classList.remove("alert_change");
            this.statusUpdate(value);
          }
        }
      ]
    });
    alert.present();
  }
}
