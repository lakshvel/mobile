import { Component, ViewChild, ElementRef } from '@angular/core';
import {
  NavController,
  NavParams,
  Content,
  ModalController,
  AlertController
} from 'ionic-angular';

import { Upilotconstants } from './../upilotconstant';
import { ServiceProvider } from './../../providers/service/service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ContactplusPage } from '../contactplus/contactplus';
import { ChangedealstatusPage } from '../changedealstatus/changedealstatus';
import { AddstakeholderPage } from '../addstakeholder/addstakeholder';
import { DealcallPage } from '../dealcall/dealcall';
import { AddnewdealPage } from '../addnewdeal/addnewdeal';
import { AddnotePage } from '../addnote/addnote';
import { EditcontactinfoPage } from '../editcontactinfo/editcontactinfo';
import { CompanytabPage } from './../companytab/companytab';
import { ContacttabsPage } from '../contacttabs/contacttabs';

//declare var dataLayer: Array<any>;

@Component({
  selector: 'page-dealtabs',
  templateUrl: 'dealtabs.html',
})
export class DealtabsPage {
  @ViewChild("fixed") mapElement: ElementRef;
  limitData: any;
  access_token: any;
  showloader: boolean = true; //Changing  the loader status to true  before calling api after api response hidding the loader
  dealData: any;
  historyData: any;
  pasthistoryData = [];
  futurehistoryData = [];
  today=new Date();
  companyData: any;
  dealAmount: any;
  stakeHolderList: any;
  fixedheight: any;
  dealPipelineStage:any;
  nextLink:any;
  enablePaging:boolean = true;
  tabDisplay:any;
  timeZone:any;//Time zone
  party_id:any;

  expanded:boolean = false;

  //To display three tabs while landing into the page with history tab details

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public service: ServiceProvider,
    public authService: AuthServiceProvider,
    public con: Upilotconstants,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController) {
    this.limitData = service.getLimitData();
  //  //console.log("limitData", this.limitData.party_id);
    //console.log("limitData 1", this.limitData);
if(this.limitData.party != undefined) {
  if(this.limitData.party.first_name != undefined) {
    var party = this.limitData.party.first_name.split(' ',2);
  } else {
    var party = this.limitData.party.split(' ',2);
  }
    this.limitData.fn = party[0];
    this.limitData.ln = (party[1]==undefined ? '': party[1]);
}
// } else {
//   var party = this.limitData.deal_name.split(' ',2);
//     this.limitData.fn = party[0];
//     this.limitData.ln = (party[1]==undefined ? '': party[1]);
// }
    if(this.limitData.id_deal==undefined){
      //console.log('asdf');
      this.limitData.id_deal=this.limitData.id_aim;
      this.limitData.deal_name = this.limitData.title;
      this.limitData.party = this.limitData.subtitle;
      this.con.notificationsCountOther=0;
      this.con.notificationsCountDeal=0;
    }

    if(this.limitData.id_party!=undefined){
      this.limitData.party_id = this.limitData.id_party;
    }
   
    if(this.limitData.party_id!=undefined){
      this.party_id = this.limitData.party_id;
    }else{
     // this.party_id = this.limitData.party.id_party;
    }

  //  //console.log(this.party_id, 'party id');
// //console.log("historyData dealpage", this.historyData); 
    this.getDealFromApi('', this.limitData.id_deal);
    
/*evol tech commented 28/03/2019*/
    // this.getInfoFromApi(
    //   '',
    //   this.party_id,
    //   navParams.get('openTab')
    // );
/*evol tech commented 28/03/2019*/

// //console.log("deal data details", this.limitData.id_deal);
    this.getHistoryFromApi(this.limitData.id_deal);
    if(navParams.get('openTab')=='history'){
      this.tabDisplay = {
        timelinePage: true,
        infoPage:false,
        contactPage: false,
        companyPage: false
      };
    }else{
      this.tabDisplay = {
        timelinePage:false,
        infoPage:true,
        contactPage: false,
        companyPage: false
      };
    }



  }

  ionViewDidLoad() {
    // this.fixedheight = this.mapElement.nativeElement.offsetHeight + 255;
    this.fixedheight = this.mapElement.nativeElement.offsetHeight + 325;
  }

  ///Get the deal details from api
  getDealFromApi(token, dealId) {
    this.showloader = true;
    this.authService
      .getData(dealId, this.con.dealDetailEndpoint + dealId)
      .then(
      result => {
        //console.log("result.data", result.data);
        this.con.dealID = result.data.id_deal;
        this.con.dealName = result.data.deal_name; // evol tech 13 Mar 2019
        this.dealData = result.data;
        this.service.setDealData(result.data);
        this.stakeHolderList = getCompleteStakeHolderdata(JSON.parse(JSON.stringify(this.dealData)));
        this.service.setInfoData(result.data);
        this.service.setStakeholderList(result.data.stakeHldList);
        this.dealAmount = convertDealValue(this.dealData.deal_value);
        this.showloader = false;
      },
      err => {
        this.showloader = false;
      }
      );

    //convertinf the deal amount
    function convertDealValue(amount) {
      return amount.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    //rearrangimg the stakeholders based on the role
    function getCompleteStakeHolderdata(data) {
      data.stakeHldList.forEach(function (stakeHolderListData) {
        var stakeholderArray = [];
        data.stakeholders.forEach(function (stakeHolderData) {
          if (stakeHolderListData.id_stakeholder == stakeHolderData.id_stakeholder) {
            stakeholderArray.push(stakeHolderData);
          }
        });
        stakeHolderListData.stakeholders = stakeholderArray;
      });
      return data.stakeHldList;
    }
  }

  //To go back from deal page to deal list page
  goBack() {
    this.navCtrl.pop();
  }

  //To redirect to company detail page
  detailCompany(companyData, to) {
    
    this.showloader = true;
    this.service.setLimitData(companyData);
    this.navCtrl.push(CompanytabPage, { openTab: to });
    this.showloader = false;
  }

  //To redirect to contact detail page
  detailContact(contactData, to) {
    
    this.showloader = true;
    this.service.setLimitData(contactData);
    this.navCtrl.push(ContacttabsPage, { openTab: to });
    this.showloader = false;
  }

  //To redirect to Deal tabs
  detailDeals(dealData, openTab) {
   
    // this.showloader = true;
    //this.service.setLimitData(dealData);
    this.limitData = dealData;
    // this.navCtrl.push(DealtabsPage, { openTab: openTab });
    // this.showloader = false;

    this.changeTab(openTab);
  }
  //tabs and related active tab data while display based on the conditions
  changeTab(tabName) {
    this.content.scrollToTop();
    switch (tabName) {
      case "info":
        if (this.dealData === undefined) {
          this.getDealFromApi(this.access_token, this.limitData.id_deal);
        }
        this.tabDisplay = {
          timelinePage: false,
          infoPage: true,
          contactPage: false,
          companyPage: false
        };
        break;

      case "history":
      // //console.log('Hiii');
          // //console.log("limitDatadeal_id_deal", this.limitData.id_deal);
        if (this.historyData === undefined) {

          this.getHistoryFromApi(this.limitData.id_deal);
        }
        this.tabDisplay = {
          timelinePage: true,
          infoPage: false,
          contactPage: false,
          companyPage: false
        };
        break;

      case "company":
        if (this.companyData === undefined) {
          this.getCompanyFromApi(this.access_token, this.dealData.party.company_id);
        }
        this.tabDisplay = {
          timelinePage: false,
          infoPage: false,
          contactPage: false,
          companyPage: true
        };
        break;

      case "contact":
        if (this.dealData === undefined) {
          this.getDealFromApi(this.access_token, this.limitData.id_deal);
        }
        this.tabDisplay = {
          timelinePage: false,
          infoPage: false,
          contactPage: true,
          companyPage: false
        };
        break;
    }
  }
  ///Get the company details from api
  getCompanyFromApi(token, contactId) {
    this.showloader = true;
    this.authService
      .getData(contactId, "contact/" + contactId + "/company")
      .then(
      result => {
        this.showloader = false;
        this.companyData = result.data;
        
        this.dealPipelineStage = this.service.getDealPipelineStage();
      },
      err => {
        this.showloader = false;
      }
      );
  }

  ///Get the history details from api
  getHistoryFromApi(contactId) {
    this.showloader = true;
    // //console.log("historyDatacontactId data", contactId);
    let formData = new FormData();
    formData.append("element_type", "deal");
    formData.append("limit", "10");
    this.authService.getPostWithAccessToken(contactId, formData, this.con.infoEndpoint + contactId + this.con.historyEndpoint).then(result => {
        // //console.log(result.data);
        // //console.log('San Hiii')
         this.showloader = false;
        this.pasthistoryData = [];
        this.futurehistoryData = [];
        this.historyData = result.data;
        // //console.log("historyData 1", this.historyData);
        for (let data of result.data) {
          if (data[data.length - 1]) {
            this.pasthistoryData.push(data);
          } else {
            this.futurehistoryData.push(data);
          }
        }
// //console.log("futurehistoryData", this.futurehistoryData);
// //console.log("pasthistoryData", this.pasthistoryData);
        if (result.paging.hasOwnProperty("next")) {
          this.nextLink = result.paging.next;
        }else{
          this.enablePaging = false;
        }
      },
      err => {
        this.showloader=false;
      }
      );
  }

    //Get the contact info from api
  getInfoFromApi(token, contactId, from) {
    this.showloader = true;
    let count=0;
    this.authService.getData(contactId, this.con.infoEndpoint + contactId).then(
      result => {
        this.getHistoryFromApi(this.party_id);
        //console.log("this.limitData.id_party", this.party_id);
        //this.showloader = false;
        // this.infoData = result.data;
        // this.limitData = result.data;
        // //console.log("this.limitData", this.limitData);
        for(let city of result.data.addresses){
          if(city.is_default==1){
            this.timeZone=city.city;
            count++;
            break;
          }
      }

      if(count==0 && result.data.addresses!=''){
        this.timeZone=result.data.addresses[0].city;
      }
        
      },
      err => {
        this.showloader = false;
      }
    );
    
  }


  // Load the history data based the the scroll the page
  doInfinite(infiniteScroll) {
    let formData = new FormData();
    this.authService.getDataBasedonScroll(this.nextLink, formData).then(
      result => {

          for (let data of result.data) {
            if (data[data.length - 1]) {
              this.pasthistoryData.push(data);
            } else {
              this.futurehistoryData.push(data);
            }

          }
        if (result.data.length == 0) {
          infiniteScroll.complete();
        }
        if (result.paging.hasOwnProperty("next")) {
          this.nextLink = result.paging.next;
        } else {
          infiniteScroll.enable(false);
        }
      },
      err => {
        setTimeout(() => {
          infiniteScroll.enable(false);
        }, 500);
      });
  }
  //Edit deal info
  editDealInfo() {
    if(this.con.isConnected){
    const profileModal = this.modalCtrl.create(AddnewdealPage, {update: this.updatePageContent.bind(this) ,dealData: this.dealData, isContact: true, dealTitle: 'Edit deal' }, { cssClass: "modal_exapn_tab" });
    profileModal.present();
    } else{
      this.con.alertMessage(this.con.noInternateConnectionMsg);
    }
  }
  //Open the add note page
  opendealorStakeholderLink() {
    if (this.con.isConnected) {
      const profileModal = this.modalCtrl.create(
        ContactplusPage,
        { showStakeholder: true, from: "deals", update: this.updatePageContent.bind(this) },
        { cssClass: "modal_exapn_tab" }
      );
      profileModal.present();
    } else {
      //show no internate connection alert
      this.con.alertMessage(this.con.noInternateConnectionMsg);
    }
  }
  //rearrangimg the stakeholders based on the role
  getStakeHolderName(stakeholderId) {
   var stakeholder = this.dealData.stakeHldList.find(item => item.id_stakeholder === stakeholderId);
    if(stakeholder===undefined){
    return '';
    } else{
      return stakeholder.stakeholder_name;
    }
  }

  //To open a modal to display change deal status view
  openChangeDealStatusPage(stage) {
    //check for internate connection
     // //console.log('stagesSummary', this.dealData.stages_summary);
    if (this.con.isConnected) {
      const profileModal = this.modalCtrl.create(
        ChangedealstatusPage,
        {

          'selectedStage': stage.id_stage, 'stagesSummary': this.dealData.stages_summary,
          'dealStatus': this.dealData.deal_status.status_name, update: this.updatePageContent.bind(this)
        },
        { cssClass: "modal_exapn_tab" }
      );
      profileModal.present();
    } else {
      //show no internate connection alert
      this.con.alertMessage(this.con.noInternateConnectionMsg);
    }
  }
  //After updating any content refrshing the content of the tabs
  updatePageContent() {
    this.getDealFromApi(this.access_token, this.limitData.id_deal);
    this.getHistoryFromApi(this.limitData.id_deal);
  }
  //Adding a stake holder
  addStakeHolder() {
    if (this.con.isConnected) {
      const profileModal = this.modalCtrl.create(
        AddstakeholderPage,
        { update: this.updatePageContent.bind(this) },
        { cssClass: "modal_exapn_tab" }
      );
      profileModal.present();
    } else {
      //show no internate connection alert
      this.con.alertMessage(this.con.noInternateConnectionMsg);
    }
  }

  //To open the Call data for a deal
  callContact() {
    if (this.dealData === undefined) {
      this.getDealFromApi(this.access_token, this.limitData.id_deal);
    } else if (!this.dealData.party.phones) {
      this.noContacts();
    } else if (this.dealData.party.phones.length == 0) {
      this.noContacts();
    } else {
      this.showloader = true;
      let contactCall = this.modalCtrl.create(
        DealcallPage,
        { update: this.updatePageContent.bind(this) },
        { cssClass: "modal_exapn_tab" }
      );
      contactCall.present();
      this.showloader = false;
    }
  }
  //No contact number avalible alert will open
  noContacts() {
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
            this.editContactInfo();
            body.classList.remove("alert_change");
          }
        }
      ]
    });
    alert.present();
  }
  //on scroll of the content appending a classs to the body
  onScroll(event) {
    const body = document.getElementsByTagName("body")[0];
    if (event.scrollTop > 30) {
      body.classList.add("info_img_scroll");
    } else {
      body.classList.remove("info_img_scroll");
    }
  }
   //Adding a Note
   addnote(){
    const profileModal = this.modalCtrl.create(AddnotePage, { update: this.updatePageContent.bind(this) }, { cssClass: "modal_exapn_tab" });
    profileModal.present();
  }

  pageName:any;
    //To redirect to company edit info page
    editContactInfo() {
      //check for internate connection
      if (this.con.isConnected) {
        this.pageName = 'addphonePopup';
        const profileModal = this.modalCtrl.create(
          EditcontactinfoPage,
          { infoData: this.dealData.party, from: "company",pageName:this.pageName, update: this.updatePageContent.bind(this) },
          { cssClass: "modal_exapn_tab" }
        );
        profileModal.present();
      } else {
        //show no internate connection alert
        this.con.alertMessage(this.con.noInternateConnectionMsg);
      }
    }

    expand(){
      this.expanded = true;
      //console.log('coming');
    }
}