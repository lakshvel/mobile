import { Component, ViewChild } from "@angular/core";
import {
  NavController,
  ViewController,
  NavParams,
  ModalController,
  Events
} from "ionic-angular";
import { CategoryandproductPage } from "../categoryandproduct/categoryandproduct";
import { EditdealvaluePage } from "../editdealvalue/editdealvalue";
import { ComautosuggestProvider } from "./../../providers/comautosuggest/comautosuggest";
import { Upilotconstants } from "../../pages/upilotconstant";
import { AutoCompleteComponent } from "ionic2-auto-complete";
import { DatePickerDirective } from "ion-datepicker";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { DatePipe } from "@angular/common";
import { isDefined } from "ionic-angular/util/util";
import { DealtabsPage } from '../dealtabs/dealtabs';
import { ServiceProvider } from "../../providers/service/service";

//declare var dataLayer: Array<any>;

@Component({
  selector: "page-addnewdeal",
  templateUrl: "addnewdeal.html",
  providers: [DatePickerDirective]
})
export class AddnewdealPage {
  //ion date picker
  @ViewChild(DatePickerDirective) public datepicker: DatePickerDirective;
  @ViewChild('searchbar') searchbar: AutoCompleteComponent;
  deal = {
    name: "",
    contactId: "",
    closingDate: "",
    category: {
      id_product_category: "",
      name_category: ""
    },
    product: [],
    totalValue: "",
    value: []
  };
  selectedContact: any;
  dealData: any;
  addDealData: any; // added by evoltech 14 Dec
  // related contact is selected or not
  isContactSelected: boolean = false;
  // Date is selected or not
  isDateSelected: boolean = false;
  // validation for the name
  nameErrorClass: boolean = false;
  // validation for the contact
  contactErrorClass: boolean = false;
  // validation for the date
  dateErrorClass: boolean = false;
  //TO show loader
  showloader: boolean = false;
  //
  apiEndPoint: string;

  //
  isFocusContact: boolean = false;

  // check user deal enter or not
  isDealNameEntered: boolean = true;

  //label Name
  labelName: string;
  //to refresh the list and detail page
  updatePageContent: any;

  dealTitle:string='New deal';

  //initilize the date for the date calender
  public initDate: Date = new Date();

  //Min date fro calender
  public minDate: Date = new Date();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public autosuggest: ComautosuggestProvider,
    public constant: Upilotconstants,
    public authService: AuthServiceProvider,
    private datePipe: DatePipe,
    public service: ServiceProvider,
    public events: Events
  ) {
    //auto suggest json key name on which data is display in list
    this.constant.autoCompleteLabel = "name";
    //deal auto search contract endpoint
    this.constant.searchComEndpoint = this.constant.dealAutoSearhContractEndpoint;

    // get deal data in case of update deal
    this.dealData = this.navParams.get("dealData");
    // //console.log("this.dealData add new deal", this.dealData);
    //get bind method to update the page content in case of updating any data
    this.updatePageContent = navParams.get('update');

    if(navParams.get('dealTitle')){
      this.dealTitle = navParams.get('dealTitle');
    }
    
    // check creating deal or updating deal
    if (isDefined(this.dealData)) {
      //Deal Update content data
      this.deal.name = this.dealData.deal_name;
      if (this.dealData.party != null) {
        this.deal.contactId = this.dealData.party.first_name;
      }
      this.deal.closingDate = this.dealData.ecd_pending;
      this.initDate = new Date(this.dealData.ecd_pending);
      this.deal.category = this.dealData.product_category_name;
      //console.log(this.deal.category);
      var productArray = [];
      for (var i = 0; i < this.dealData.products.length; i++) {
        productArray.push({
          id_product: this.dealData.products[i][0],
          name_product: this.dealData.products[i][1],
          isSelect: true
        });
      }
      var dealValuesArray = [];

      for (var j = 0; j < this.dealData.deal_values.length; j++) {
        var duration = "";
        if (this.dealData.deal_values[j].duration != 0) {
          duration = this.dealData.deal_values[j].duration;
        }
        dealValuesArray.push({
          id_deal_value: this.dealData.deal_values[j].id_deal_value,
          value: this.dealData.deal_values[j].amount,
          frequency: this.dealData.deal_values[j].frequency,
          duration: duration,
          product_qty: this.dealData.deal_values[j].product_qty
          
        });
      }

      this.deal.product = productArray;
      this.deal.value = dealValuesArray;
      this.deal.totalValue = this.dealData.deal_value;
      //console.log(this.deal.totalValue, this.dealData, 'adflaksh');
      this.apiEndPoint = this.constant.editDealEndpoint;
      this.labelName = "UPDATE";
    } else {
      this.apiEndPoint = this.constant.createDealEndpoint;
      //  this.initDate = new Date();
      this.labelName = "CREATE";
    }
  }


  ionViewDidLoad() {
    if (this.deal.product.length > 0) {
      const body = document.getElementById("catandprod");
      body.classList.add("dl_subcat_prodc");
    }
    if (this.deal.contactId != "") {
      this.getUpdateSelection(this.dealData.party);
    }
    if (this.deal.closingDate != "") {
      this.dateSelected(false);
    } else {
      this.dateSelected('NO');
    }
  }

  // To close the Popup
  goBack() {
    this.viewCtrl.dismiss();
   
  }

  //Adding new contact
  addNewDeal() {
    if (!this.deal.name) {
      this.nameErrorClass = true;
      this.constant.alertMessage(this.constant.dealNamevalidation);
      return false;
    } else {
      this.nameErrorClass = false;
    }
    if (this.isContactSelected) {
      this.contactErrorClass = false;
    } else {
      this.contactErrorClass = true;
      this.constant.alertMessage(this.constant.dealcontactvalidation);
      return false;
    }
    if (!this.isDateSelected) {
      this.dateErrorClass = true;
      this.constant.alertMessage(this.constant.dealdatetvalidation);
      return false;
    } else {
      this.dateErrorClass = false;
    }
    this.showloader = true;

    var requestDate = this.datePipe.transform(this.initDate, "MMM d, y");
    var updaterequestDate = this.datePipe.transform(this.initDate, "yyyy-MM-dd");
    let formData = new FormData();
    if (isDefined(this.dealData)) {
      formData.append("id_deal", this.dealData.id_deal);
      formData.append("closing_date", updaterequestDate);
    } else {
      formData.append("closing_date", requestDate);
    }

    formData.append("deal_name", this.deal.name);
    formData.append("id_contact", this.selectedContact.id_party);

    if (this.deal.category.id_product_category != "") {
      formData.append(
        "id_product_category",
        this.deal.category.id_product_category
      );
    }

    var index = 0;
    for (let product of this.deal.product) {
      formData.append("array_id_product[" + (index++) + "]", product.id_product);
    }
    var x = 0;
    for (let currentValue of this.deal.value) {
      var y = 0;
      if (isDefined(this.dealData)) {
        formData.append("array_value[" + x + "][" + (y++) + "]", currentValue.id_deal_value);
      }
      formData.append("array_value[" + x + "][" + (y++) + "]", currentValue.frequency);
      formData.append("array_value[" + x + "][" + (y++) + "]", currentValue.value);
      formData.append("array_value[" + x + "][" + (y++) + "]", currentValue.duration);
      formData.append("array_value[" + (x++) + "][" + (y++) + "]", currentValue.product_qty);

    }

    this.authService
      .getPostWithAccessToken("", formData, this.apiEndPoint)
      .then(
        result => {
          this.showloader = false;
          if (result.hasOwnProperty("error")) {
            this.constant.alertMessage(result.error.msg);
          } else {
            if (isDefined(this.dealData)) {
              this.updatePageContent();
            }

            // this.constant.alertMessage(this.constant.dealCreatedMsg);
            this.viewCtrl.dismiss();
            // added by evoltech 14th dec
            this.getDealFromApi('', result.data.id_deal);

            this.createDealPublish(result.data.id_deal);

          }
        },
        err => {
          this.showloader = false;
        }
      );
  }

  createDealPublish(createDealPub) {
     //console.log('User created!', createDealPub);
    // this.getDealFromApi('', createDealPub);
    this.events.publish('deal:createDealPublish', createDealPub, Date.now());
  }


// added by evoltech 14th dec
    ///Get the deal details from api
  getDealFromApi(token, dealId){
    
    this.showloader = true;
    this.authService
      .getData(dealId, this.constant.dealDetailEndpoint + dealId)
      .then(
      result => {
        // //console.log(result);
        this.constant.dealID = result.data.id_deal;
        this.addDealData = result.data;
        this.service.setLimitData(this.addDealData);
        this.navCtrl.push(DealtabsPage, { openTab: 'history' });
        // this.viewCtrl.dismiss();
        // this.goBack();
        this.showloader = false;
      },
      err => {
        this.showloader = false;
      }
      );
  }


  // open the select category model
  openCategory() {
    if (this.isFocusContact) { return 0; }
    const profileModal = this.modalCtrl.create(
      CategoryandproductPage,
      { proAndCat: this.deal },
      { cssClass: "modal_exapn_tab dl_cat_main_pop" }
    );
    profileModal.onDidDismiss(data => {
      this.deal.category = data.category;
      this.deal.product = data.product;
      if (this.deal.product.length > 0) {
        const body = document.getElementById("catandprod");
        body.classList.add("dl_subcat_prodc");
      }
    });
    profileModal.present();
  }
  // open the enter deal value model
  openDealValue() {
    if (this.isFocusContact) { return 0; }

    //console.log(this.deal);

    const profileModal = this.modalCtrl.create(
      EditdealvaluePage,
      { dealValue: this.deal },
      { cssClass: "modal_exapn_tab dl_cat_main_pop" }
    );

    // //console.log(data.totalValue);
    //get the response on dismiss of deal value model
    profileModal.onDidDismiss(data => {
      this.deal.totalValue = data.totalValue;
      this.deal.value = data.valueArray;
    });
    profileModal.present();
  }

  // trigger when date is selected
  dateSelected(event) {
    if (event == "NO") {
      return 0;
    }
    this.isDateSelected = true;
    const body = document.getElementById("datePicker");
    body.classList.add("dl_auto_sl_bg");
  }
  // trigger when contract is selected from auto suggest
  getSelection(event) {
    this.selectedContact = event;
    if (this.isDealNameEntered) {
      this.deal.name = this.selectedContact.new_deal_name
    }
    this.isContactSelected = true;
    const body = document.getElementById("reletedcontact");
    body.classList.add("dl_auto_sl_bg");
    body.classList.add("auto_filt_sl_img");
  }


  getUpdateSelection(data) {
    this.selectedContact = data;
    var conName = '';
    if (this.selectedContact.hasOwnProperty("first_name") &&
      this.selectedContact.first_name != null) {
      conName = this.selectedContact.first_name;
    }
    if (this.selectedContact.hasOwnProperty("last_name") &&
      this.selectedContact.last_name != null) {
      conName = conName + ' ' + this.selectedContact.last_name;
    }
    if (conName != '') {
      this.selectedContact.name = conName;
    }

    this.isContactSelected = true;
    const body = document.getElementById("reletedcontact");
    body.classList.add("dl_auto_sl_bg");
    body.classList.add("auto_filt_sl_img");
  }

  //convert deal value in dollor format
  convertDealValue(amount) {
    return amount.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  //focus in the releated contact
  focusInFunction() {
    this.isFocusContact = true;
  }

  //focus out the releated contact
  focusOutFunction() {
    setTimeout(() => {
      this.isFocusContact = false;
    }, 300);
  }

  //check daeal name is entered or not
  focusDealName(data) {
    this.isDealNameEntered = false;
  }

  
}
