import { Upilotconstants } from './../upilotconstant';
import { AuthServiceProvider } from "./../../providers/auth-service/auth-service";
import { Component, ViewChild, ElementRef } from "@angular/core";
import { NavController, Content, ModalController, MenuController ,NavParams } from "ionic-angular";
import { ServiceProvider } from "../../providers/service/service";
import { ContactorcompanycallPage } from "../contactorcompanycall/contactorcompanycall";
import { ContactplusPage } from '../contactplus/contactplus';
import { EditcompanyinfoPage } from '../editcompanyinfo/editcompanyinfo';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { AddnewcontactorcompanyPage } from '../addnewcontactorcompany/addnewcontactorcompany';
import { AddnewdealPage } from '../addnewdeal/addnewdeal';
import { AddnotePage } from '../addnote/addnote';
import { ChangecontactstatusPage } from '../changecontactstatus/changecontactstatus';
import { DealtabsPage } from '../dealtabs/dealtabs';
import { ContacttabsPage } from '../contacttabs/contacttabs';

//declare var dataLayer: Array<any>;

@Component({
  selector: "page-companytab",
  templateUrl: "companytab.html"
})
export class CompanytabPage {
  @ViewChild("fixed") mapElement: ElementRef;
  fixedheight: any; //To fix the height of the company image and header
  infoData: any; //To store the company info
  dealData: any; //To store the deals info
  contactData: any; //To store the contact details from api
  companyData: any; //Company Data
  limitData: any;
  showloader: boolean = false; //Loader hide and show
  timeZone:any;//Time zone
  checklistOption: any = []; //To store checklist options
  today=new Date();
  @ViewChild(Content) content: Content;

  historyData: any;
  //company past history data
  pasthistoryData = [];
  //company future history data
  futurehistoryData = [];
  //get Future History number of data
  fLength:number;
  // Link for next set of record
  nextLink:any;
  // enable or disable the scroll infinite 
  enablePaging:boolean = true;
  //
  pageName:string = 'otherpage';

  //To display three tabs while landing into the page with history tab details
  tabDisplay :any;

  isCreated:boolean = false;

  constructor(
    public con: Upilotconstants,
    public authService: AuthServiceProvider,
    private service: ServiceProvider,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public nav:NavParams,
    public menu: MenuController,
    public alertCtrl: AlertController
  ) {
    //this.menu.enable(false, 'myMenu');//To hide the side menu
    this.companyData = service.getCompanyDetail(); //Get the company details from service
    this.limitData = service.getLimitData();
      this.getInfoFromApi(
        '',
        this.limitData.id_party,
        nav.get('openTab')
      );
    if( nav.get('openTab')=='history'){
      this. tabDisplay = {
        historyPage: true,
        infoPage: false,
        dealsPage: false,
        contactsPage: false
      };
    }else{
      this. tabDisplay = {
        historyPage: false,
        infoPage: true,
        dealsPage: false,
        contactsPage: false
      };
    }
  }
  //Intially this method will load
  ionViewDidLoad() {
    this.fixedheight = this.mapElement.nativeElement.offsetHeight + 10;
    this.isCreated = this.nav.get('isCreated');
  }

  //tabs and related active tab data while display based on the conditions
  changeTab(tabName) {
    this.content.scrollToTop();
    switch (tabName) {
      case "info":
        if (this.infoData === undefined) {
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
            contactsPage: false
          };
        }
        break;
      case "history":
        this.tabDisplay = {
          historyPage: true,
          infoPage: false,
          dealsPage: false,
          contactsPage: false
        };
        break;
      case "deals":
        if (this.dealData === undefined) {
          this.getCompanyDealFromApi(
            '',
            this.limitData.id_party
          );
        } else {
          this.tabDisplay = {
            historyPage: false,
            infoPage: false,
            dealsPage: true,
            contactsPage: false
          };
        }

        break;
      case "contacts":
        if (this.contactData === undefined) {
          this.getCompanyContactFromApi(
            '',
            this.limitData.id_party
          );
        } else {
          this.tabDisplay = {
            historyPage: false,
            infoPage: false,
            dealsPage: false,
            contactsPage: true
          };
        }

        break;
    }
  }

  //To open the Call data for a contact
  callCompany() {
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
          from: "company",
          update: this.updatePageContent.bind(this)
        },
        { cssClass: "modal_exapn_tab" }
      );
      contactCall.present();
      this.showloader = false;
    }
  }

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
            this.editCompanyInfo();
            body.classList.remove("alert_change");
          }
        }
      ]
    });
    alert.present();
  }
  //To open a mobal to display add note and add contact
  clickOnFabButton() {
    //check for internate connection
    if (this.con.isConnected) {
      const profileModal = this.modalCtrl.create(
        ContactplusPage,
        {
          isCompany: true, from: "company",
          id:this.limitData.id_party,
          update: this.updatePageContent.bind(this)
        },
        { cssClass: "modal_exapn_tab" }
      );
      profileModal.present();
    } else {
      //show no internate connection alert
      this.con.alertMessage(this.con.noInternateConnectionMsg);
    }
  }

  // ********************************************************************************

  // Adding a body class while scroll to fix the header
  onScroll(event) {
    const body = document.getElementById("ioncontentId");
    if (event.scrollTop > 30) {
      body.classList.add("info_img_scroll");
    } else {
      body.classList.remove("info_img_scroll");
    }
  }

  editCompanyInfoPage(){
    this.pageName = 'otherpage;';
    this.editCompanyInfo();
  }

  //To redirect to company edit info page
  editCompanyInfo() {
    //check for internate connection
    if (this.con.isConnected) {
      const profileModal = this.modalCtrl.create(
        EditcompanyinfoPage,
        { infoData: this.infoData, from: "company",pageName:this.pageName, update: this.updatePageContent.bind(this) },
        { cssClass: "modal_exapn_tab" }
      );
      profileModal.present();
    } else {
      //show no internate connection alert
      this.con.alertMessage(this.con.noInternateConnectionMsg);
    }
  }
  //Update the page contect after editing the info,note ect.,
  updatePageContent() {
    this.getInfoFromApi('', this.limitData.id_party, "");
      this.con.updateListPageContent();//refresh the list data.
  }
  //Get the contact info from api
  getInfoFromApi(token, contactId, from) {
    this.showloader = true;
    var checklistValue = '';
    var ar = [];
    let count=0;
    this.authService.getData(contactId, this.con.infoEndpoint + contactId).then(
      result => {
        this.getHistoryFromApi(this.limitData.id_party);
        //this.showloader = false;
        this.infoData = result.data;
        this.limitData = result.data;
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
        this.service.setInfoData(this.infoData);
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
          this.callCompany();
        } else if (from == "info") {
          this.changeTab("info");
        }

        if(this.isCreated) {
          this.editCompanyInfoPage();
          this.isCreated = false;
        }
      },
      err => {
        this.showloader = false;
      }
    );
    function isContainsElement(element) {
      return (ar.indexOf(element) != -1);
    }
  }

  ///Get the contact deals details from api
  getHistoryFromApi(contactId) {
    // this.showloader = true;
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
        this.getCompanyDealFromApi(
          'history',
          this.limitData.id_party
        );
        this.pasthistoryData = [];
        this.futurehistoryData = [];
        this.showloader = false;
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
//Infinite scroll for history data.
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

  ///Get the company details from api
  getCompanyDealFromApi(token, contactId) {
    this.showloader = true;
    this.authService
      .getData(
      contactId,
      this.con.infoEndpoint + contactId + this.con.dealsEndpoint
      )
      .then(
      result => {
      //  this.showloader = false;
      this.getCompanyContactFromApi(
        'dealTab',
        this.limitData.id_party
      );
        this.dealData = result.data;
        if(token!='history'){
          this.changeTab("deals");
        }
       
        this.service.setDealData(this.dealData)
      },
      err => {
        this.showloader = false;
      }
      );
  }

  // Get the company related contacts from api
  getCompanyContactFromApi(token, contactId) {
    this.showloader = true;
    this.authService
      .getData(
      contactId,
      this.con.infoEndpoint + contactId + this.con.companyEndpoint
      )
      .then(
      result => {
        this.showloader = false;
        this.contactData = result.data;
        this.service.setContactDetail(result.data);
        if(token!='dealTab'){
          this.changeTab("contacts");
        }
        
        //  this.navCtrl.push(ContacttabsPage);
      },
      err => {
        this.showloader = false;
      }
      );
  }
  //To go back from company page to cotact list page
  goBack() {
    this.navCtrl.pop();
  }

  //To go back from company page to cotact list page
  onSelectChange(data) {
    if (this.con.isConnected) {
      //open postpone model
      const profileModal = this.modalCtrl.create(
        ChangecontactstatusPage,
        {
          statusList: data,
          statusMoudle: 'company'
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
    } else {
      this.con.alertMessage(this.con.noInternateConnectionMsg);
    }

  }


  //Add new Contact
  addNewContact() {
    let emailOrWebsite = {
      'email': '',
      'id':this.limitData.id_party
    };
    const profileModal = this.modalCtrl.create(AddnewcontactorcompanyPage, { emailOrWebsite: emailOrWebsite, isContact: true }, { cssClass: "modal_exapn_tab" });
    profileModal.present();
  }

  //Add new deal
  addNewDeal() {
    const profileModal = this.modalCtrl.create(AddnewdealPage, {},{ cssClass: "modal_exapn_tab" });
    profileModal.present();
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
  //To redirect to contact detail page
  detailContact(contactData, to) {
   
    this.showloader = true;
    this.service.setLimitData(contactData);
    this.navCtrl.push(ContacttabsPage, { openTab: to });
    this.showloader = false;
  }

  
}
