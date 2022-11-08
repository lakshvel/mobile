import { Component } from "@angular/core";
import { NavController, NavParams, ViewController, AlertController } from "ionic-angular";
import { Upilotconstants } from "../upilotconstant";
import { ServiceProvider } from "../../providers/service/service";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

@Component({
  selector: "page-changecontactstatus",
  templateUrl: "changecontactstatus.html"
})
export class ChangecontactstatusPage {

  refreshList = {
    status: false,
    status_name: ''
  };
  // Data from previous page
  limitData: any;
  //Changing  the loader status to ture  before calling api after api response hidding the loader
  showloader: boolean = false;
  //status List
  statusList: any;

  statusMoudle:any;
  //update page content
  //updatePageContent: any;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: ServiceProvider,
    public con: Upilotconstants,
    public authService: AuthServiceProvider,
    public alertCtrl: AlertController
  ) {
    this.limitData = service.getLimitData();

    this.statusList = navParams.get("statusList");
    this.statusMoudle = navParams.get("statusMoudle");
    //To calling agenda list method to refresh the page
    // this.updatePageContent = this.navParams.get("update");
  }

  ionViewDidLoad() {
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("blur_pop_up");
  }

  //Remove the blur class  from body after closing the modal
  removeBodyBlurClass() {
    this.viewCtrl.dismiss(this.refreshList);
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("blur_pop_up");
  }
//Calling this while view leaving to remove body class
  ionViewWillLeave() {
    this.removeBodyBlurClass();
  }

  // To close the Popup
  goBack() {
    this.removeBodyBlurClass();
  }

  //update the company status
  changeStatus(data) {
    var statusId = data.status_id
   
    let formData = new FormData();
    formData.append("status_id", statusId);
    //console.log("statusId ", this.statusMoudle);

    if(this.statusMoudle == 'company'){
        this.companyStatusPopup(formData,data);
    } else{
      this.callUpdateStatusForConOrCom(formData,data);
    }
  }

  //Update Status For Contact or Company
  callUpdateStatusForConOrCom(formData : FormData,data:any){

    this.showloader = true;
    this.authService
      .getPostWithAccessToken(
        "",
        formData,
        this.con.infoEndpoint +
        this.limitData.id_party +
        this.con.updatestatusEndpoint
      )
      .then(
        result => {
          this.showloader = false;
          //console.log(result);
          if (result.error !== undefined) {
            this.con.alertMessage(result.error.msg);
          } else {
            this.refreshList.status_name = data.status_name;
            this.refreshList.status = true;
            this.goBack();
          }
        },
        err => {
          this.showloader = false;
        }
      );

  }

  //trigger the popup for the company
  companyStatusPopup(formData :FormData,data :any){
    //console.log(data);
    let alert = this.alertCtrl.create({
      message: this.con.changeStatusForCompany,
      buttons: [
        {
          text: 'No',
          role: 'No',
          handler: () => {
            formData.append("update_contact", 'No');
            this.callUpdateStatusForConOrCom(formData,data);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            formData.append("update_contact", 'Yes');
            this.callUpdateStatusForConOrCom(formData,data);
          }
        }
      ]
    });
    alert.present();

  }
}
