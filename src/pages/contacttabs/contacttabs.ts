import { Upilotconstants } from './../upilotconstant';
import { EditcontactinfoPage } from './../editcontactinfo/editcontactinfo';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController,Content, NavParams, ModalController, MenuController, AlertController, Navbar, Events  } from 'ionic-angular';
import { ServiceProvider } from './../../providers/service/service';
import { ContactorcompanycallPage } from '../contactorcompanycall/contactorcompanycall';
import { ContactplusPage } from '../contactplus/contactplus';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AddnewdealPage } from '../addnewdeal/addnewdeal';
import { AddnewcontactorcompanyPage } from './../addnewcontactorcompany/addnewcontactorcompany';
import { AddnotePage } from '../addnote/addnote';
import { ChangecontactstatusPage } from '../changecontactstatus/changecontactstatus';
import { DealtabsPage } from '../dealtabs/dealtabs';
import { CompanytabPage } from './../companytab/companytab';

//declare var dataLayer: Array<any>;

@Component({
  selector: "page-contacttabs",
  templateUrl: "contacttabs.html"
})
export class ContacttabsPage {
  infoData: any;//contact info data
  dealData: any;//Contact deals
  historyData: any;//Contact history
  pasthistoryData = [];//Contact past history
  futurehistoryData = [];//Contact future history
  //get Future History number of data
  fLength:number;
  contactData: any;//contact data
  limitData: any;// Data from previous page
  nextLink:any;
  arrowUp: boolean = true;
  enablePaging:boolean = true;
  timeZone:any;
  checklistOption: any = []; //To store checklist options
  today=new Date();
  dealPipelineStage:any;
  pageName:string = 'otherpage';
  isCompanyDataPresent:boolean;
  currenttime:any;
  ///To avoid the error for no company associated with  a contact
  noDataForContact = {
    data: {
      info: {},
      contacts: [],
      deals: []
    }
  };
  showloader: boolean = false; //Changing  the loader status to ture  before calling api after api response hidding the loader
  //To display three tabs while landing into the page with history tab details
  tabDisplay :any;
  autoIncId:number =0;
  
  isCreated:boolean = false;

  @ViewChild(Content) content: Content;

  @ViewChild(Navbar) Navbar: Navbar;

  constructor(
    public constant: Upilotconstants,
    public authService: AuthServiceProvider,
    public navCtrl: NavController,
    public service: ServiceProvider,
    public nav: NavParams,
    public modalCtrl: ModalController,
    public menu: MenuController,
    public con: Upilotconstants,
    public alertCtrl: AlertController,
    public events: Events
  ) {

    //this.menu.enable(false, 'myMenu');//To hide the side menu
    this.limitData = service.getLimitData();
    //console.log("contactlimitdatatabpage", this.limitData);
    //console.log("contactlimitdatatabpage", this.limitData.id_party);
    //console.log("contactlimitdatatabpage", this.limitData.id_aim);
    if(this.limitData.id_party==undefined){
      this.limitData.id_party = this.limitData.id_aim;
    }
    
    this.getInfoFromApi(
      '',
      this.limitData.id_party,
      nav.get('openTab')
    );
    if( nav.get('openTab')=='history'){
      this.tabDisplay = {
        historyPage: true,
        infoPage: false,
        dealsPage: false,
        companyPage: false
      };
    }else{
      this.tabDisplay = {
        historyPage: false,
        infoPage: true,
        dealsPage: false,
        companyPage: false
      };
    }
//console.log("Contactdealtab", this.limitData);
    this.events.subscribe('deal:createDealPublish', (createDealPub, time) => {
        //console.log('createDealPub ========> '+createDealPub);
        this.getDealFromApi('contactTab', this.limitData.id_party);

      });

  }
  //tabs and related active tab data while display based on the conditions
  changeTab(tabName) {
    this.content.scrollToTop();
    switch (tabName) {
      case "info":
        if (this.infoData === undefined) {
          //  this.getContactFromApi(this.access_token,this.limitData.id_party);
          this.getInfoFromApi(
            '',
            this.limitData.id_party,
            "direct"
          );
        } else {
          this.tabDisplay = {
            historyPage: false,
            infoPage: true,
            dealsPage: false,
            companyPage: false
          };
        }

        break;
      case "history":
        if (this.historyData === undefined) {
          this.getHistoryFromApi(this.limitData.id_party);
        } else {
          this.tabDisplay = {
            historyPage: true,
            infoPage: false,
            dealsPage: false,
            companyPage: false
          };
        }
        break;
      case "deals":
        if (this.dealData === undefined) {
          this.getDealFromApi('', this.limitData.id_party);
        } else {
          this.tabDisplay = {
            historyPage: false,
            infoPage: false,
            dealsPage: true,
            companyPage: false
          };
        }

        break;
      case "company":
        if (this.contactData === undefined) {
          this.getContactFromApi('', this.limitData.id_party);
        } else {
          this.tabDisplay = {
            historyPage: false,
            infoPage: false,
            dealsPage: false,
            companyPage: true
          };
        }

        break;
    }
  }
  //To open the Call data for a contact
  callContact() {
    if (this.infoData === undefined) {
      this.getInfoFromApi('', this.limitData.id_party, "call");
    } else if (!this.infoData.phones) {
      this.noContacts();
    } else if (this.infoData.phones.length == 0) {
      this.noContacts();
    } else {
      this.showloader = true;
      let contactCall = this.modalCtrl.create(
        ContactorcompanycallPage,
        {
          from: "contact",
          update: this.updatePageContent.bind(this)
        },
        { cssClass: "modal_exapn_tab" }
      );
      contactCall.present();
      this.showloader = false;
    }

  }
  //To open a mobal to display add note and add company
  clickOnFabButton() {
    //check for internate connection
    if (this.constant.isConnected) {
      const profileModal = this.modalCtrl.create(
        ContactplusPage,
        {
          isCompany: false, from: "contact", id:this.limitData.id_party,
          update: this.updatePageContent.bind(this)
        },
        { cssClass: "modal_exapn_tab" }
      );
      profileModal.present();
    } else {
      //show no internate connection alert
      this.constant.alertMessage(this.con.noInternateConnectionMsg);
    }
  }

  //To edit contact info 
  editContactInfoPage(){
    this.pageName = 'otherpage;';
    this.editContactInfo();
  }

  //To redirect to company edit info page
  editContactInfo() {
    //check for internate connection
    if (this.con.isConnected) {
      const profileModal = this.modalCtrl.create(
        EditcontactinfoPage,
        { infoData: this.infoData, from: "company",pageName:this.pageName, update: this.updatePageContent.bind(this) },
        { cssClass: "modal_exapn_tab" }
      );
      profileModal.present();
    } else {
      //show no internate connection alert
      this.constant.alertMessage(this.con.noInternateConnectionMsg);
    }
  }
  //Refresh the data afte successfully updated
  updatePageContent() {
    this.getInfoFromApi('', this.limitData.id_party, "");
    this.con.updateListPageContent();
  }

  // ******************************************************************Started**

  @ViewChild("fixed") mapElement: ElementRef;
  fixedheight: any;
 //This methos runs after view loaded
  ionViewDidLoad() {
    this.fixedheight = this.mapElement.nativeElement.offsetHeight + 10;
    this.isCreated = this.nav.get('isCreated');
  }


//This method triggers while view leaving
  ionViewWillLeave(){
    const body = document.getElementById("ioncontentId");
    body.classList.remove("info_img_scroll");

  }

  // IonViewDidEnter(){
  //   //console.log("IonViewDidEnter", this.limitData.id_party)
  //     this.getDealFromApi('', this.limitData.id_party);
  // }

  // Adding a body class while scroll to fix the header
  onScroll(event) {
    const body = document.getElementById("ioncontentId");
    if (event.scrollTop > 30) {
      body.classList.add("info_img_scroll");
    } else {
      body.classList.remove("info_img_scroll");
    //  this.fixedheight = this.mapElement.nativeElement.offsetHeight + 10;
    }
  }
  //Get the contact info from api
  getInfoFromApi(token, contactId, from) {
    this.showloader = true;
    var checklistValue = '';
    var ar = [];
    this.authService.getData(contactId, "contact/" + contactId).then(
      result => {
        let count=0;
        let countData=0;
       this.showloader = false;
      //console.log("contact details", result.data);
        this.getHistoryFromApi(this.limitData.id_party);
        this.infoData = result.data;
        //console.log("this.infoData contact us", this.infoData);
        this.service.setInfoData(this.infoData);
        this.limitData = result.data;
        //console.log("addresses", result.data.addresses);
        //console.log("timezone_identifier", result.data.timezone_identifier);
        //(16-06-2020 @Laksh) - removed temp because does not work with 12 hour local time setting 
        // if(result.data.timezone_identifier!=''){
        //   var d = new Date();
        //   var s = d.toLocaleString(undefined, { timeZone: result.data.timezone_identifier, year:'numeric', month: '2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' });
        //   //console.log(s, 'locale styring');
        //   var my_string = s.replace(/,/g,"");
        //   //console.log("my_string", my_string);
        //   var newDate = my_string.slice(0,-12);
        //   var newTime = my_string.slice(11);
        //   //console.log(newTime, "newDate", newDate);
        //   // this.currenttime = my_string;
        //   var newDateData = newDate.split('/').reverse();
        //   var currentdate =   newDateData[0]+'/'+newDateData[1]+'/'+newDateData[2];
        //   this.currenttime = currentdate+' '+newTime;
        //   //console.log("currenttime", this.currenttime);
        // }
        this.currenttime = '';
        
        // //console.log('offsetvalue', s);
        for(let city of result.data.addresses){
            if(city.is_default==1){
              this.timeZone=city.city;
              count++;
              break;
            }
        }

       
        
        if(count==0 && result.data.addresses!=''){
          this.timeZone=result.data.addresses[0].city;
          // var d = new Date();
          //     var s = d.toLocaleString(undefined, { timeZone: "Europe/London" });
          //     //console.log('offset value1', s);
        }
        if (this.infoData.customFields) {
          for (let item of this.infoData.customFields) {
            if (item.label == 'Checklist') {
              checklistValue = item.value;
              break;
            }
          }

          if (checklistValue) {
            ar = checklistValue.split(', ');
            if (ar.length > 0) {
              this.checklistOption = [
                { name: 'Option 1', isChecked: isContainsElement('Option 1') },
                { name: 'Option 2', isChecked: isContainsElement('Option 2') },
                { name: 'Option 3', isChecked: isContainsElement('Option 3') }
              ];
            }
          }
        }

        if (from == "call") {
          this.callContact();
        } else if (from == "info") {
          this.changeTab("info");
        }

        if(this.isCreated) {
            this.editContactInfoPage();
            this.isCreated = false;
        }
      },
      err => {
        this.showloader = false;
      }
    );
    //checking the info having the checklist
    function isContainsElement(element) {
      return (ar.indexOf(element) != -1);
    }
  }
  ///Get the contact deals details from api
  getDealFromApi(token, contactId) {

    //console.log("getDealFromApi_"+token+" "+contactId);
    this.showloader = true;
    this.authService.getData(contactId, this.con.infoEndpoint + contactId + this.con.dealsEndpoint).then(
      result => {
        this.showloader = false;
        //console.log("contactPageDealTab");
        
        this.dealData = result.data;
        //console.log(this.dealData);
        this.service.setDealData(this.dealData);
        if(token!='contactTab'){
          this.changeTab("deals");
        }
       // 
      },
      err => {
        this.showloader = false;
        this.service.setDealData(this.dealData);
      }
    );
  }

  ///Get the contact deals details from api
  getHistoryFromApi(contactId) {
    this.showloader = true;
    let formData = new FormData();
    formData.append("element_type", "party");
    formData.append("limit", "10");
    this.authService
      .getPostWithAccessToken(
      contactId,
      formData,
      this.con.infoEndpoint + contactId + this.con.historyEndpoint
      )
      .then(
      result => {
      this.getContactFromApi('', contactId);
        //this.showloader = false;
        this.pasthistoryData = [];
        this.futurehistoryData = [];
        this.historyData = result.data;
        for (let data of result.data) {
          if (data[data.length - 1]) {
            this.pasthistoryData.push(data);
          } else {
            this.futurehistoryData.push(data);
          }
        }
        this.fLength = this.futurehistoryData.length +1;
        if (result.paging.hasOwnProperty("next")) {
          this.nextLink = result.paging.next;
        }else{
          this.enablePaging = false;
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
          this.fLength = this.futurehistoryData.length +1;
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

  ///Get the contacts details from api
  getContactFromApi(token, contactId) {//alert();
    //this.showloader = true;
    this.authService
      .getData(contactId, this.con.infoEndpoint + contactId + this.con.companyEndpoint)
      .then(
      result => {
        //this.changeTab("company");
        
        this.isCompanyDataPresent=true;
        this.dealPipelineStage = this.service.getDealPipelineStage();
        this.contactData = result.data;
        this.service.setContactDetail(result.data);
        this.service.setErrorForContactCompanyEmpty(null);
        this.getDealFromApi('contactTab', this.limitData.id_party);
        this.showloader = false;

      },
      err => {
        this.getDealFromApi('contactTab', this.limitData.id_party);
        this.isCompanyDataPresent=false;
        this.contactData = this.noDataForContact.data;
        this.service.setContactDetail(this.noDataForContact.data);
        this.service.setErrorForContactCompanyEmpty(err);
        this.service.setDealData(this.dealData);
        this.showloader = false;
      }
      );
  }
  //To go back from company page to cotact list page
  goBack() {
    //this.navCtrl.setRoot(ContactlistPage, { pagefor: 'Contacts' });
   // this.navCtrl.popAll();
   this.navCtrl.pop();
  }

  //To go back from company page to cotact list page
  onSelectChange(data) {
    if (this.constant.isConnected) {
    //open postpone model
    const profileModal = this.modalCtrl.create(
      ChangecontactstatusPage,
      {
        statusList: data,
        statusMoudle: 'contact'
      },
      { cssClass: "modal_exapn_tab" }
    );
    profileModal.present();
    //trigger when model is close
    profileModal.onDidDismiss(data => {
      if (data.status) {
        this.infoData.status_name = data.status_name;
      }
    });

    }
    else {
      this.constant.alertMessage(this.con.noInternateConnectionMsg);
    }
  }

  //Add new deal
  addNewDeal() {
    const profileModal = this.modalCtrl.create(AddnewdealPage,{}, { cssClass: "modal_exapn_tab" });
    profileModal.present();
  }

  //To redirect to add new Company page
  addNewCompany() {
    let emailOrWebsite = {
      'website': '',
      'id':this.limitData.id_party
    };
    const profileModal = this.modalCtrl.create(AddnewcontactorcompanyPage, { emailOrWebsite: emailOrWebsite, isContact: false }, { cssClass: "modal_exapn_tab" });
    profileModal.present();
  }
  //on click of the call icon if company have one phone numbers.
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
            this.pageName = 'addphonePopup';
            this.editContactInfo();
            body.classList.remove("alert_change");
          }
        }
      ]
    });
    alert.present();
  }
  //Adding a Note
  addnote(){
    const profileModal = this.modalCtrl.create(AddnotePage, { update: this.updatePageContent.bind(this) }, { cssClass: "modal_exapn_tab" });
    profileModal.present();
  }

  //To redirect to Deal tabs
  detailDeals(dealData, openTab) {
   
    this.showloader = true;
    this.service.setLimitData(dealData);
    this.navCtrl.push(DealtabsPage, { openTab: openTab });
    this.showloader = false;
  }

  //To redirect to company detail page
  detailCompany(companyData, openTab) {
   
    this.showloader = true;
    this.service.setLimitData(companyData);
    this.navCtrl.push(CompanytabPage, { openTab: openTab });
    this.showloader = false;
  }
  //To redirect to contact detail page
  detailContact(contactData, to) {

    this.showloader = true;
    this.service.setLimitData(contactData);
    this.navCtrl.push(ContacttabsPage, { openTab: to });
    this.showloader = false;
  }

}
