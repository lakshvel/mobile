import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service'
import { Upilotconstants } from '../upilotconstant';
import { AutoCompleteComponent } from "ionic2-auto-complete";
import { DatePickerDirective } from "ion-datepicker";
import { ComautosuggestProvider } from "./../../providers/comautosuggest/comautosuggest";
import { AddnotePage } from '../addnote/addnote';
import { DealnameautocompleteProvider } from "../../providers/dealnameautocomplete/dealnameautocomplete"
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { DatePipe } from '@angular/common';
import { EditdealvaluePage } from '../editdealvalue/editdealvalue';
import { ResponsibleautocompleteProvider } from '../../providers/responsibleautocomplete/responsibleautocomplete';
import moment from 'moment';


@Component({
  selector: 'page-createtask',
  templateUrl: 'createtask.html',
  providers: [DatePickerDirective]
})
export class CreatetaskPage {
  @ViewChild(DatePickerDirective) public datepicker: DatePickerDirective;
  task: any;

  // show loader
  showLoader: boolean = false;

  // validation for the name
  nameErrorClass: boolean = false;

  // check user deal enter or not
  isDealNameEntered: boolean = true;

  // Date is selected or not
  isDateSelected: boolean = false;
  isOpenSecondTaskList: boolean = false;
  isContactAutocomplete: boolean;
  isAssignedContactAutocomplete: boolean;
  initDate: any;
  minMaxDate: any;

  taskAdd = {
    name: "",
    contactId: "",
    taskDate: "",
    id_deal: "",
    note: "",
    uid_user: "",
    first_name:"",
    last_name:"",
    typecreate: 'false',
    id_owner_responsible : ''
  };
  selectedContact: any;
  selectedAssignedContact: any;
  selectedAssignedContactName:any;
  selectedDeal: any;

  from: any;

  taskList: any;
  activeClassCount: number = 0;
// uid_user: any;
  isContactSelected: boolean = false;
  isAssignedToSelected: boolean = false;
  isDealSelected: boolean = false;
  @ViewChild('searchbar') searchbar: AutoCompleteComponent;
  // validation for the date
  dateErrorClass: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCntl: ViewController,
    public service: ServiceProvider,
    public constant: Upilotconstants,
    public autosuggest: ComautosuggestProvider,
    public dealAutosuggest: DealnameautocompleteProvider,
    public responsibleUser: ResponsibleautocompleteProvider,
    public modalCtrl: ModalController,
    public authService: AuthServiceProvider,
    public alertCtrl: AlertController,
    public datePipe: DatePipe) {
    this.from = this.navParams.get('from');
    this.task = this.navParams.get('task');
    this.getProfileData();
    if (this.from == 'log') {
      this.taskTypeList();
    } else {
      this.taskAdd.name = this.task.type_name;
      if (navParams.get('tabPage') !== undefined) {
        this.dataFromPreviousPage(navParams.get('tabPage'));
      }
    }
    this.minMaxDate = new Date();
    let date = this.datePipe.transform(this.minMaxDate, "MMM dd yyyy - hh:mm a");
    this.initDate = date;

    //console.log("taskAdd147", this.taskAdd);
    // //console.log("logis", this.from);
   // Evol tech edited 14/02/2019

   // //console.log(this.taskAdd.id_deal);
   //  if(this.taskAdd.id_deal!=''){
   //    this.selectedDeal.party_details.picture_path=null
   //    this.isDealSelected = false;
      
   //  }

    // this.taskAdd.id_deal='';

    //console.log("autoselectcontact", this.selectedContact);

    
  }

    //TO get logged user data
  // picture_path: any;
  
  searchassigned(){
    //console.log('adf', this.searchbar.getValue());
    this.searchbar.getValue()
  }
  
  

  getProfileData() {
    var formData = new FormData();
    this.authService
      .getPostWithAccessToken("", formData, this.constant.meEndpoint)
      .then(
        result => {
       
         // this.taskAdd = result;
         this.isAssignedToSelected = true;
          this.isAssignedContactAutocomplete = false;

          this.taskAdd.uid_user = result.first_name + ' ' + result.last_name;
          this.taskAdd.id_owner_responsible = result.user_id;
          this.selectedAssignedContact = result;
          if(this.selectedAssignedContact.picture_path=='defaultUser'){
            this.selectedAssignedContact.picture_path = null;
          }else{
            this.selectedAssignedContact.picture_path = result.picture_path;
          }
          
          // //console.log('----');
          // //console.log(this.selectedAssignedContact);
          // //console.log('====');
          this.selectedAssignedContactName = this.taskAdd.uid_user;
         // //console.log("selectedAssignedContactpicture_path", this.selectedAssignedContact.picture_path);
         //  //console.log("selectedAssignedContactName", this.selectedAssignedContactName);
        
        }
      );
  }

  ionViewDidLoad() {
    this.task = this.navParams.get('task');
    this.constant.autoCompleteLabel = this.constant.autoCompleteLabelName;
    this.constant.searchComEndpoint = this.constant.contactOrCompanyAutoCompleteEndpoint;
  }
  //To dismiss the modal
  goBack() {
    let alert = this.alertCtrl.create({
      message: this.constant.closeTaskPopup,
      buttons: [
        {
          text: 'No',
          role: 'No',
          handler: () => {
            //console.log("No Selected");
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.viewCntl.dismiss();
          }
        }
      ]
    });
    alert.present();
  }
  
  //add new task  
  addNewTask() {
    if (!this.taskAdd.name) {
      this.nameErrorClass = true;
      this.constant.alertMessage(this.constant.taskNamevalidation);
      return false;
    } else {
      this.nameErrorClass = false;
    }

    if (!this.initDate) {
      this.dateErrorClass = true;
      this.constant.alertMessage(this.constant.taskdatetvalidation);
      return false;
    } else {
      this.dateErrorClass = false;
    }
    
    this.showLoader = true;
    let formData = new FormData();
    formData.append('id_type_task', this.task.id_type_task);
    formData.append('title', this.taskAdd.name);
    moment().utcOffset(moment().format('Z'))
    ////console.log(this.minMaxDate, moment.utc(this.minMaxDate).utc().format('yyy-mm-dd hh:ss a'), 'laksh');
    
    //moment.utc(this.minMaxDate);
    var date = moment.utc(this.minMaxDate).utc().format('YYYY-MM-DD');//this.datePipe.transform(this.minMaxDate, "yyyy-MM-d");
    var time = moment.utc(this.minMaxDate).utc().format('hh:mm A');//this.datePipe.transform(this.minMaxDate, "h:mm a");
    //console.log(date, time, 'new date time');
    formData.append('date', date);
    formData.append('time', time);
    if (!this.isContactSelected) {
      formData.append("id_party", '');
    } else {
      formData.append("id_party", this.selectedContact.id_party);
    }
    if (!this.isDealSelected) {
      formData.append("id_deal", '');
    } else {
      formData.append("id_deal", this.selectedDeal.id_deal);
    }
    formData.append("note", this.taskAdd.note);
    if (this.from == 'log') {
      formData.append("typecreate", 'log');
    }

    formData.append("id_owner_responsible", this.taskAdd.id_owner_responsible)

    this.authService.getPostWithAccessToken('', formData, this.constant.taskCreateEndpoint).then(
      result => {
        // //console.log("Test Task Data", result);
        this.showLoader = false;
        if (result.error === undefined) {
          this.constant.alertMessage(this.constant.taskCreatedMsg);
          this.navCtrl.popAll();
        } else {
          this.constant.alertMessage(result.error.msg);
        }
      }, err => {
        this.showLoader = false;
      }
    )
  }
  //Removing the dot after entering task name
  focusDealName(data) {
    this.isDealNameEntered = false;
  }
  ///Calling this after click on the contact selected for related contacts to display the 
  getSelection(event) {
    this.selectedContact = event;
    //console.log("selectedContact", this.selectedContact);
    this.isContactAutocomplete = false;
    this.isContactSelected = true;
    const body = document.getElementById("reletedcontact");
    body.classList.add("dl_auto_sl_bg");
    this.updateTaskName();
  }
//calling assigned to
  getAssignedSelection(event){
    this.selectedAssignedContact = event;
    //console.log("selectedAssignedContact", this.selectedAssignedContact);
    this.isAssignedContactAutocomplete = true;
    this.isAssignedToSelected = true;
    this.taskAdd.id_owner_responsible = this.selectedAssignedContact.id_user;
    this.taskAdd.uid_user = this.selectedAssignedContact.user_name;
    const body = document.getElementById("reletedassignedcontact");
    body.classList.add("dl_auto_sl_bg");
  }

  contactId: any;
  dateSelected(event) {
    this.isDateSelected = true;
    const body = document.getElementById("datePicker");
    body.classList.add("dl_auto_sl_bg");
  }
  //open note modal
  openAddNote() {
    const profileModal = this.modalCtrl.create(AddnotePage, { note: this.taskAdd.note, typecreate: this.taskAdd.typecreate, from: 'task', update: this.updatePageContent.bind(this) }, { cssClass: "modal_exapn_tab" });
    profileModal.present();
  }
  //append the note into note field
  updatePageContent(noteorDate, datetime) {
    if (datetime !== undefined) {
      let date = this.datePipe.transform(noteorDate, 'MMM. dd ,yyyy hh:mm a');
      this.initDate = date;
      this.minMaxDate = noteorDate;
    } else {
      this.taskAdd.note = noteorDate.noteDes;
      this.taskAdd.typecreate = noteorDate.toggleSet;
    }

  }
  //geting the first letter of the first name and last name
  nameSpace(name) {
    let format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    if (name) {
      let sliceName = name.split(" ");
      if (sliceName.length <= 1) {
        return sliceName[0].slice(0, 1);
      } else {
        if (sliceName[1].match(format)) {
          return sliceName[0].slice(0, 1);
        } else {
          return sliceName[0].slice(0, 1) + sliceName[1].slice(0, 1);
        }
      }
      ;
    }
  }

  //get the deal data
  getDealData(event) {
    this.isDealSelected = true;
    this.selectedDeal = event;
    //console.log("selectedDeal", this.selectedDeal);
    const body = document.getElementById("dealname");
    if (event.party_details.hasOwnProperty('id_party')) {
      this.isContactAutocomplete = false;
      if (this.isContactSelected) {
        this.selectedContact = event.party_details;
        this.taskAdd.contactId = event.party_details.name;
      } else {
        this.isContactSelected = true;
        this.selectedContact = event.party_details;
        this.taskAdd.contactId = event.party_details.name;
        const relatedContact = document.getElementById("reletedcontact");
        relatedContact.classList.add("dl_auto_sl_bg");
        //  relatedContact.classList.add("auto_filt_sl_img");
      }
    }
    this.updateTaskName();
    body.classList.add("dl_auto_sl_bg");
    // body.classList.add("auto_filt_sl_img");
  }
  //Get task list
  taskTypeList() {
    this.showLoader = true;
    this.authService.getData('', this.constant.taskTypeListEndoint).then(
      result => {
        this.showLoader = false;
        this.taskList = result.data;
        this.task = result.data[0];
        if (this.navParams.get('tabPage') !== undefined) {
          this.dataFromPreviousPage(this.navParams.get('tabPage'));
        } else {
          this.taskAdd.name = this.task.type_name;
        }
      }, err => {
      }
    )
  }
  //select the task data 
  taskSelected(taskData, i, listForm) {
    this.task = taskData;
    this.updateTaskName();
    if (listForm == 'secondList') {
      const scnd_li_ul = document.getElementById('scnd_li_ul');
      scnd_li_ul.classList.add('active_ts');
      this.activeClassCount = i + 4;
      this.isOpenSecondTaskList = false;
    } else {
      this.activeClassCount = i;
    }
  }
  //to remaining list of task
  opensecondTaskList() {
    if (this.isOpenSecondTaskList) {
      this.isOpenSecondTaskList = false;
    } else {
      this.isOpenSecondTaskList = true;
    }
  }
  updateTaskName() {

    if (this.isContactSelected && this.isDealSelected) {
      this.taskAdd.name = this.task.type_name + ' - ' + this.taskAdd.contactId + ' - ' + this.selectedDeal.deal_name;
    }
    else if (this.isContactSelected) {
      this.taskAdd.name = this.task.type_name + ' - ' + this.taskAdd.contactId;
    } else if (this.isDealSelected) {
      this.taskAdd.name = this.task.type_name + ' - ' + this.selectedDeal.deal_name;
    } else {
      this.taskAdd.name = this.task.type_name;
    }
  }

  dataFromPreviousPage(tabPage) {

    //console.log("services getDealData ",this.service.getDealData().id_deal);
    //console.log("tabPage", tabPage);
    if (tabPage == 'deals') {
      let deal = {
        'id_deal': this.service.getDealData().id_deal,
        'deal_name': this.service.getDealData().deal_name,
        'party_details': this.service.getDealData().party
      }
      if (this.service.getDealData() !== undefined) {
        this.isDealSelected = true;
        this.isContactSelected = true;
        this.isContactAutocomplete = true;
        // this.isAssignedToSelected = true;
        this.selectedContact = this.service.getDealData().party;
        this.taskAdd.contactId = this.selectedContact.first_name + ' ' + this.selectedContact.last_name;
        this.taskAdd.contactId = this.taskAdd.contactId.replace('null', '');
        this.selectedDeal = deal;
        //console.log("selectedDealdealname", this.selectedDeal.deal_name);
        this.taskAdd.id_deal = this.selectedDeal.deal_name;
      }
    }
    else if (tabPage == 'contact') {
      this.isContactSelected = true;
      this.isContactAutocomplete = true;
      // this.isAssignedToSelected = true;
      this.selectedContact = this.service.getLimitData();
      this.taskAdd.contactId = this.selectedContact.first_name + ' ' + this.selectedContact.last_name;
      this.taskAdd.contactId = this.taskAdd.contactId.replace('null', '');
      //evol tech commented on updateDealData
      // this.updateDealData();
    }
    else if (tabPage == 'company') {
      if (this.service.getContactDetail() !== undefined && this.service.getContactDetail().contacts != '') {
        this.isContactSelected = true;
        this.isContactAutocomplete = true;
        // this.isAssignedToSelected = true;
        this.selectedContact = this.service.getContactDetail().contacts[0];
        this.taskAdd.contactId = this.selectedContact.first_name + ' ' + this.selectedContact.last_name;
        this.taskAdd.contactId = this.taskAdd.contactId.replace('null', '');
      }
      //evol tech commented on updateDealData
      // this.updateDealData();
    }
    this.updateTaskName();
  }

  updateDealData() {
    if (this.service.getDealData() !== undefined && this.service.getDealData().deals != '') {
      this.isDealSelected = true;
      let deal = {
        'id_deal': this.service.getDealData().deals[0].id_deal,
        'deal_name': this.service.getDealData().deals[0].deal_name,
        'party_details': this.selectedContact
      }
      this.selectedDeal = deal;

      this.taskAdd.id_deal = this.selectedDeal.deal_name;
      // this.taskAdd.id_deal='';
      // //console.log("selectedDeal deal_name", this.taskAdd.id_deal);
      //console.log(this.from);
    }
  }
  openDateTimePicker() {
    const profileModal = this.modalCtrl.create(EditdealvaluePage, { istask: true, from: this.from, update: this.updatePageContent.bind(this), initDate: this.minMaxDate }, { cssClass: "modal_exapn_tab datetimePicker" });
    profileModal.present();
  }
}
