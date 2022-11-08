import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, Events } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service'
import { Upilotconstants } from '../upilotconstant';
import { ComautosuggestProvider } from "./../../providers/comautosuggest/comautosuggest";
import { AddnotePage } from '../addnote/addnote';
import { DealnameautocompleteProvider } from "../../providers/dealnameautocomplete/dealnameautocomplete"
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { DatePipe } from '@angular/common';
import { EditdealvaluePage } from '../editdealvalue/editdealvalue';
import moment from 'moment';

@Component({
  selector: 'page-taskedit',
  templateUrl: 'taskedit.html',
})
export class TaskeditPage {

  taskEdit = {
    name: "",
    contactName: "",
    taskDate: "",
    id_deal: "",
    note: "",
    uid_user: "",
    first_name:"",
    last_name:"",
    typecreate: 'false'
  };
  task: any;
  selectedAssignedContact: any;
  selectedAssignedContactName:any;
  selectedContact: any;
  selectedDeal: any;
  initDate: any;

  nameErrorClass: boolean;
  dateErrorClass: boolean;
  isDateSelected: boolean = true;
  isContactSelected: boolean;
  isDealSelected: boolean
  isContactAutocomplete: boolean;
  isDealAutocomplete: boolean;
  isAssignedContactAutocomplete: boolean;
  isAssignedToSelected: boolean;
  showLoader: boolean;
  // check user deal enter or not
  isDealNameEntered: boolean = true;
  updatePageContents: any;
    minMaxDate:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCntl: ViewController,
    public service: ServiceProvider,
    public constant: Upilotconstants,
    public autosuggest: ComautosuggestProvider,
    public dealAutosuggest: DealnameautocompleteProvider,
    public modalCtrl: ModalController,
    public authService: AuthServiceProvider,
    public datePipe: DatePipe,
    public events: Events
    ) {

    this.updatePageContents = navParams.get('update');
    this.task = navParams.get('task');
    this.taskEdit.name = this.task.task_title;
    this.taskEdit.taskDate = this.task.task_due_date;
    this.minMaxDate=this.task.task_due_date;

    if (this.task.contact != null) {
      this.selectedContact = this.task.contact;
      //console.log(this.selectedContact);
      this.isContactAutocomplete = true;
      this.isContactSelected = true;

      /**Evol Team edited**/
      if(this.task.contact.last_name==null){
        this.task.contact.last_name = "";
      }

      if(this.task.contact.first_name==null){
        this.task.contact.first_name = "";
      }
      /**Evol Team edited**/

      this.taskEdit.contactName = this.task.contact.first_name + ' ' + this.task.contact.last_name;
    }

    if (this.task.deal != null) {
      this.isDealSelected = true;
      this.isDealAutocomplete = true;
      this.selectedDeal = this.task.deal;
      this.selectedDeal.picture_path = this.selectedContact.picture_path;
      this.taskEdit.id_deal = this.task.deal.deal_name;
    }

    if (this.task.last_note != null) {
      this.taskEdit.note = this.task.last_note.text;
    }


    this.initDate = new Date(this.task.task_due_date);
    this.initDate = this.datePipe.transform(this.initDate, "MMM. d, yyyy - h:mm a");
    this.constant.autoCompleteLabel = this.constant.autoCompleteLabelName;
    this.constant.searchComEndpoint = this.constant.contactOrCompanyAutoCompleteEndpoint;


  }

  //Dismiss the modal
  goBack() {
    this.viewCntl.dismiss();
  }
  //Edit task data
  editTask() {
    if (this.taskEdit.name == '' || this.taskEdit.name == null) {
      this.nameErrorClass = true;
      this.constant.alertMessage(this.constant.taskNamevalidation);
      return false;
    } else {
      this.nameErrorClass = false;
    }
    if (!this.isDateSelected) {
      this.dateErrorClass = true;
      this.constant.alertMessage(this.constant.taskdatetvalidation);
      return false;
    } else {
      this.dateErrorClass = false;
    }
    this.showLoader = true;
    // if (this.isDealSelected) {
    //   var rel_con = document.getElementById('related_contact_id'); 
    // }
    this.showLoader = true;
    
    var old_date = this.datePipe.transform(this.taskEdit.taskDate, "yyyy-MM-d");
    var old_time = this.datePipe.transform(this.taskEdit.taskDate, "h:mm a");
   // var new_date = this.datePipe.transform(this.minMaxDate, "yyyy-MM-d");
   // var new_time = this.datePipe.transform(this.minMaxDate, "h:mm a");
    var new_date = moment.utc(this.minMaxDate).utc().format('YYYY-MM-DD');
    var new_time = moment.utc(this.minMaxDate).utc().format('hh:mm A');
    let formData = new FormData();
    formData.append('id_task', this.task.id_task);
    formData.append('id_type_task', this.task.id_type_task);
    formData.append('title', this.taskEdit.name);
    formData.append('date', new_date);
    formData.append('time', new_time);
    formData.append('new_local_date', new_date);
    formData.append('new_local_time', new_time);
    formData.append('old_local_date', old_date);
    formData.append('old_local_time', old_time);
    formData.append("note", this.taskEdit.note);


    if (this.isContactSelected) {
      formData.append('id_party', this.selectedContact.id_party);
    } else {
      formData.append('id_party', '');
    }

    /*Edited by 13 Mar 2019*/
    if (this.isDealSelected) {
      formData.append('id_deal', this.selectedDeal.id_deal);
    } else {
      formData.append('id_deal', '');
    }
    /*Edited by 13 Mar 2019*/
    this.authService.getPostWithAccessToken('', formData, 'task/edit').then(
      result => {
        //console.log("Task Edit", result);
        this.showLoader = false;
        if (result.status == 'success') {
          this.constant.alertMessage(this.constant.taskUpatedMsg);
          this.viewCntl.dismiss();
          this.taskPublish();
          this.updatePageContents();
          
          // this.createDealPublish(result.data.id_deal);
        }
        else if (result.error !== undefined) {
          this.constant.alertMessage(result.error.msg);
        }
      }, err => {
        this.showLoader = false;
      }
    )
  }

  taskPublish() {
    // body...
    //console.log('task:taskPublish');
    this.events.publish('task:taskPublish', Date.now());
  }

  //Removing the dot after entering task name
  focusDealName(data) {
    this.isDealNameEntered = false;
  }

  //select contact data form auto complete
  getSelection(data) {
    this.isContactAutocomplete = false;
    this.selectedContact = data;
    // //console.log(this.selectedContact);
    this.isContactSelected = true;
    const body = document.getElementById("reletedcontact");
    body.classList.add("dl_auto_sl_bg");
  }

//calling assigned to
  getAssignedSelection(event){
    this.selectedAssignedContact = event;
    //console.log("selectedAssignedContact", this.selectedAssignedContact);
    this.isAssignedContactAutocomplete = false;
    this.isAssignedToSelected = true;
    const body = document.getElementById("reletedassignedcontact");
    body.classList.add("dl_auto_sl_bg");
  }

  //Select deal data from auto complete
  getDealData(data) {
    this.isDealAutocomplete = false;
    this.isContactAutocomplete = false;

    this.isDealSelected = true;
    this.selectedDeal = data;
    const body = document.getElementById("dealname");
    if (data.party_details.hasOwnProperty('id_party')) {
      if (this.isContactSelected) {
        this.selectedContact = data.party_details;
        this.taskEdit.contactName = data.party_details.name;
      } else {
        this.isContactSelected = true;
        this.selectedContact = data.party_details;
        this.taskEdit.contactName = data.party_details.name;
        const relatedContact = document.getElementById("reletedcontact");
        relatedContact.classList.add("dl_auto_sl_bg");
      }
    }
    body.classList.add("dl_auto_sl_bg");
  }
  //Open add note modal
  openAddNote() {
    const profileModal = this.modalCtrl.create(AddnotePage, { note: this.taskEdit.note, typecreate: this.taskEdit.typecreate, from: 'task', update: this.updatePageContent.bind(this) }, { cssClass: "modal_exapn_tab" });
    profileModal.present();
  }
  //update the selected date form datepicker 
  updatePageContent(noteorDate,datetime) {
    if(datetime!==undefined){
      let date=this.datePipe.transform(noteorDate,'MMM. dd ,yyyy hh:mm a');
      this.initDate=date;
      this.minMaxDate=noteorDate;
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
  //Open modal for date and time picker
  openDateTimePicker(){
    const profileModal = this.modalCtrl.create(EditdealvaluePage, { istask:true, from: 'edit', update: this.updatePageContent.bind(this),initDate:this.minMaxDate }, { cssClass: "modal_exapn_tab datetimePicker" });
    profileModal.present();
  }
}
