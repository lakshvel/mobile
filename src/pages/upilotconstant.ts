/**
 * upilotconstant.ts is contain all the constant variable which do not change. 
 * It conatins all validation message, all Api end Point and sqlite database table name
 *  
 */

import { AlertController } from "ionic-angular";
import { Injectable } from "@angular/core";

@Injectable()
export class Upilotconstants {
  constructor(public alertCtrl: AlertController) { }

  //check network status
  isConnected: boolean = true;

  // Check device is android
  isAndroidPlatform: boolean = false;

  // Check device is Iphone
  isIOSPlatform: boolean = false;

  // Check device is ipad
  isIPadPlatform: boolean = false;


  openNotifications: boolean = true;

  //Variable to update the list data is case of any apdate is happen
  updateListPageContent: any;

  //hide/show on focus of input field
  hideFooter:boolean = false;


  //no internate connection message
  noInternateConnectionMsg = "Sorry, Internet connection  appears to be offline";

  //htmlInternetConnection message
  htmlInternetConnectionMsg = "No Internet Connection";

  //no internate connection message
  logoutMsg = "Are you sure you want to log out?";

  //message if there is not contact is assciate with the task
  noContactMsg = "No contact associate with this task";

  //message if there is not Mail is assciate with the task  
  noMailMsg = "No mail associate with this task";

  //now record found message in the listing page
  noRecordMsg = "No records found - try switching to another view or add new";

  // Chane the company status message
  changeStatusForCompany = "Update all related contacts to the same status?";

  //Close mock-up for log Task
  closeTaskPopup = "Are you sure you want to close?";


  //show number of data ata time
  recordlimit:any = "100";

  offsetRecords:number=0;

  //Notifications limit
  notificationsLimit = "30";

  //hide the paragraph if the content data height is grater the this height
  // hide/show the paragraph
  maxPHeightToHide = 52;

  //Empty
  emptyString = "";

  // Contstant zero
  ZERO = 0;

  // Contstant one
  ONE = 1;

  // Contstant two
  TWO = 2;

  // Contstant three
  THREE = 3;

  // Contstant YES
  YES = "Yes";

  // Contstant NO
  NO = "No";
  //close_app
  closeApp = [];
  //cache contact list filter values
  cachedContactlistFilterValue: number = -111;

  cachedDealsListFilterValue: number = -111;

  //Start background process
  startBackgroundProcess: boolean;

  //**** Dispaly the history image based of the condition *******//

  //contact/company history note
  historyNote = "note";

  //contact/company history task
  historyTask = "task";

  //contact/company history email
  historyEmail = "email";

  //contact/company history activity
  historyActivity = "activity";

  //contact/company history activity deal
  historyActivityDeal = "deal";

  //contact/company history activity contact
  historyActivityCon = "contact";

  //contact/company history activity contact deals icon json key
  historyDealValue = "icon_DealValue";

  //contact/company history activity contact contact edit icon json key
  historyiconPenEdit = "icon_PenEdit";

  //contact/company history activity contact contact task lunch icon json key
  historyTaskLunch = "icon_TaskLunch";

  historyTaskEmail = "icon_TaskEmail";

  historyTaskPresentation = "icon_TaskPresentation";

  historyTaskCall = "icon_TaskCall";

  historyTaskMeeting = "icon_TaskMeeting";

  historyTaskShipping = "icon_TaskShipping";

  historyTaskOther = "icon_TaskOther";

  historyTaskTraining = "icon_TaskTraining";

  historyTaskTradeShow = "icon_TaskTradeShow";

  historyiconDeal = "deal";

  historyiconDealLost = "icon_DealLost";

  historyiconDealPending = "icon_DealPending";

  historyiconDealWon = "icon_DealWon";


  autoCompleteLabelCompanyName = "company_name";

  autoCompleteLabelName = "name";



  //Add stakeholder success message
  addStakeHolderSucessMsg = "Stakeholder added successfully";

  //side menu link
  sidemenuLink = {
    recentlyviewed: "Recently Viewed",
    contacts: "Contacts",
    deals: "Deals",
    pipleline: "Pipleline",
    agenda: "Tasks"
  };

  //display the Month name in agenda List
  monthArray = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC"
  ];


  //Deal frequency value
  dealFrequencyValue = [
    { value: 'one', text: 'One time' },
    { value: 'hourly', text: 'Hourly' },
    { value: 'daily', text: 'Daily' },
    { value: 'weekly', text: 'Weekly' },
    { value: 'monthly', text: 'Monthly' },
    { value: 'annually', text: 'Annual' }
  ];

  //NotificationsResult
  notificationsResult: any;

  //notifications count
  notificationsCount: number;
  notificationsCountOther: number;
  notificationsCountDeal: number;

  //Agenda cached filter
  agendaCachedFilter: number;

  /********************* JSON KEY ************************************/
  //login api grantType
  grantType = "grant_type";

  //login api clientId
  clientId = "client_id";

  //login api clientSecret
  clientSecret = "client_secret";

  //login api username
  username = "username";

  //login api password
  password = "password";

  //if user has nultiple account
  multipleAccounts = "multiple_accounts";

  /*********************API Endpoint *****************************/

  //api endpoint for auth
  loginAuthEndpoint = "token";

  //api endpoint for get user detail
  meEndpoint = "me";

  //api endpoint for get user detail
  contactfiterEndpoint = "contact/filter-list";

  //api end for deals filter list
  dealfilterEndpoint = "deal/filter-list";
  //api endpoint for get contact
  contactsEndpoint = "contacts";

  //api endpoint for get contact/company info details
  infoEndpoint = "contact/";

  //api endpoint for get contact/company deals details
  dealsEndpoint = "/deals";

  //API for Deals
  dealslistEndpoint = "deals";
  //api endpoint for get contact/company company details
  companyEndpoint = "/company";

  //api endpoint for get contact/company company details
  historyEndpoint = "/history";

  //to update the search company api
  searchComEndpoint = "";

  autoCompleteLabel = "";

  //to update the contact/company status
  updatestatusEndpoint = "/update-status";

  //Deals pipe line list
  dealPipelitsEndpoint = "deal/pipeline-stages";

  //api end for deals detail
  dealDetailEndpoint = "deal/";

  //add stake holder
  addStakeHolder = "/deal/add-stakeholder";

  //DealId
  dealID: string;
  dealName:string;
  //Change deal status
  changeDealStatus = "deal/update-status";

  //Deal lost reason
  dealLostReason = "deal/lost-reason-list";

  //update deal status
  updateDealStatus = "deal/update-stage";

  //api endpoint for get agenda
  agendaEndpoint = "tasks";

  //api endpoint for get agenda
  addNoteEndpoint = "/add-note";

  //api endpoint for get task detail
  taskDetailEndpoint = "task/";

  //api endpoint for get task detail
  taskstatusDoneEndpoint = "/done";

  //api endpoint for get task detail
  taskstatusCancelEndpoint = "/cancel";

  //api endpoint for get task detail
  taskstatusPostponeEndpoint = "postpone";

  //api endpoint for deal category
  dealCategoryEndPoint = "deal/categories";

  //api endpoint for deal product
  dealProductEndPoint = "/products";

  //api endpoint for deal currency
  dealCurrencyEndPoint = "deal/currency";

  //api endpoint for create deal
  createDealEndpoint = "deal/create";

  //api endpoint for edit deal
  editDealEndpoint = "deal/edit";

  //api endpoint for create company
  createcompanyEndpoint = "contact/create-company";

  //api endpoint for deal Auto Searh Contract
  dealAutoSearhContractEndpoint = "deal/search-contact-company";

  //api endpoint for Responsible Users Search
  responsibleUserSearchEndpoint = "contact/search-responsible-user";
  
  //company auto complete api
  companyAutoCompleteEndpoint = "contact/search-company";

  //contact and company auto comple
  contactOrCompanyAutoCompleteEndpoint = "contact/search-contact-company";

  //Edit contact info api
  editContactInfoEndpoint = "contact/edit-contact";

  //Edit company info api
  editCompanyInfoEndpoint = "contact/edit-company";

  //Country list api
  countryListEndpoint = "contact/country-list";

  //company or contact edit detalis

  companyOrContactEditDetailsEndpoint = "contact/edit-details/";

  //Create contact
  createContactEndpoint = "contact/create-contact";

  //Global search API
  globalSearchEndpoint = "search?keyword=";

  //Notifications endpoint
  notificationsEndpoint = "notifications";

  //Notifications Count 
  notificationsCountEndpoint = "notification-count";

  //Recently viewed Endpoint
  recentlyViewedEndpoint = "recent-items";

  //Task type list endpoint
  taskTypeListEndoint = "task-types";

  //Task Deal search
  addTaskDealAutoCompleteEndpoint = "deal/search-deal";

  //Create task 
  taskCreateEndpoint = "task/create";

  //Agenda dropdown end point
  agendaFilterEndpoint = "task/filter-list";

  agendaContactEndpoint = "contact/";

  cluster = '';
  subdomain = '';


  /*********************Validation Message ***********************/

  //empty validation for login page
  successfullyDone = "Successfully done";

  //empty validation for login page
  emptyValidationforLogin = "Username and password required";

  //empty validation for email
  emptyEmailValidation = "Email is Required";

  //first name validation 
  firstNameValidaions = "First name is required";

  //empty validation for email
  invalidEmailFormat = "Invalid email format";

  //empty validation for Password
  emptyPasswordValidation = "Password is Required";

  //empty Company name validation 
  companyNameValidation = "Company name required";

  //empty validation for Note
  emptyNoteValidation = "Note is Required";

  //empty validation for Note
  updateStatusMsg = "Update all related contacts to the same status?";

  // Edited by Evolteam, 13th Dec
  //Deal create msg
  dealCreatedMsg="Deal created";

  //Deal pending status updated
  DealUpdatePending = "Deal Status Updated Successfully";

  //No contacts
  noContact = "No phone number available.";

  //Requird company url message
  companyURL = "Company url is Required.";

  //Requird company url message
  companyValidURL = "Please enter valid url";

  //Requird deal contact message
  dealNamevalidation = "Deal name is Required";

  //Requird task name message
  taskNamevalidation = "Task name is Required";

  //Requird deal name message
  // dealcontactvalidation = "Related contact is Required";
  dealcontactvalidation = "Please enter an existing contact";

  //Requird deal date message
  dealdatetvalidation = "Expecting closing date is Required";

  //Requird Task date message
  taskdatetvalidation = "Set date for task";

  //Deal marked as pending
  notificationDealMarkedPending = "Deal marked as pending";

  //Deal marked as Changed
  notificationDealMarkedChanged = "Deal value has changed";

  //Deal marked as Lost
  notificationDealMarkedLost = "Deal value has lost";

  //Deal marked as Won
  notificationDealMarkedWon = "Deal value has won";

  //Deal assigned to you
  notificationDealAssignedYou = "Deal assigned to you";

  //Deal Note added
  notificationDealNoteAdded = "A note has been added";

  //Deal Note Comment
  notificationDealNoteComment = "A comment has been added to note";

  //Deal Note mentioned
  notificationDealNoteMentioned = "mentioned you on a note";

  //other_task_assigned
  notificatinOtherTask = "Other Task";

  //add Stake holder company validation
  addCompanyname = "Select a contact name";

  // Add stake holder choose role
  addStakeholderRole = "Choose a role";

  //Email formate validation
  emailFormateValidation = "Please enter valid email id";

  /******Success message for server response *************/
  //Edit contact info success message
  contactUpdateSuccessMsg = "Contact details updated successfully";

  //Edit company info success msg
  companyUpdateSuccessMsg = "Company details updated successfully";

  //Deal reopened success message
  dealReopenedSuccessfully = "Deal reopened successfully";

  //task post pone success message
  taskPostponedSuccessMsg = "Task postponed successfully";

  //Task update successfully
  taskUpatedMsg="Task updated sucessfully";

  // Edited by Evolteam, 13th Dec
  //Task update successfully
  // taskCreatedMsg="Task create sucessfully";
  taskCreatedMsg="Task created";

  //Forgot password sub-domain validation
  forgotPasswordSubdomainMsg="please enter sub-domain";

  //Forgotpassword username and sub-domain validation
  forgotPasswordUsernameSubdomainMsg="Please enter username and sub-domain";

  //Forgot password username validation
  forgotPaswordUsernameMsg="Please enter Username";

  /************************ Server error message handling  ***************/
  //forbidden error type
  forbiddenError = "forbidden";

  //500 Error msg 
  internalErrorHandling = "Something went wrong";


  /************************ local Storage Table Name ********************/

  //this table is used for chaking user is already logined in on not
  // and cearing the local storage if login with other user or subdomain
  loginstatus = "loginedinuserdata";

  //storing for the token and user detail
  tokenanduser = "tokenanduserdetail";

  //storing for the token and user detail
  contactfilterdata = "contactfilterdata";

  //api endpoint for get contact
  contactsTable = "contactlist";

  //api endpoint for get contact
  contactdetails = "contactdetails";

  //Storing deal list in table

  dealsTable = "dealslist";
  //Storing Deals pipe line list

  dealsDetailsTable = "dealsdetails";
  //Storing Deals pipe line list

  dealsPipelineListTable = "dealsPipeList";

  agendaListTable = "agegdaList";

  agendaDeatilTable = "agendaDeatil";

  //UPilot Temporary table

  tempTable = "tempTableOffline";

  isContactLoaded = false;
 
  isDealLoaded = false;
  
  contactList = null;

  dealList = null;

  contactOptions = [];

  dealOptions = [];

  dealPipelineStage = [];

  totalDealValue = '0';

  currencyDataValue = '';

  //*********************** Common method *******************************/

  //Display alert without  title in the Alert
  alertMessage(msg) {
    let alert = this.alertCtrl.create({
      subTitle: msg,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: "OK",
          handler: () => { }
        }
      ]
    });
    alert.present();
  }

  // show the hide content if it having data more then three line
  clickonArrowDown(id) {
    const arrowDown = document.getElementById("arrowDownId" + id);
    const arrowUp = document.getElementById("arrowUpId" + id);
    const contentId = document.getElementById("contentId" + id);
    contentId.style.height = `auto`;
    contentId.style.overflow = `visible`;
    arrowDown.style.display = `none`;
    arrowUp.style.display = `block`;

  }
  // hide the hide content on click of arrow up key
  clickonArrowUp(id) {
    const arrowDown = document.getElementById("arrowDownId" + id);
    const arrowUp = document.getElementById("arrowUpId" + id);
    const contentId = document.getElementById("contentId" + id);

    contentId.style.height = this.maxPHeightToHide + `px`;
    contentId.style.overflow = `hidden`;
    arrowDown.style.display = `block`;
    arrowUp.style.display = `none`;

  }

  //calculating the time difference
  timeMethod(cereateTime, Currenttime) {
    var dueDate = new Date(cereateTime.replace(/-/g, "/"));
    var dueTimeValue = Date.UTC(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate(),
      dueDate.getHours(),
      dueDate.getMinutes(),
      dueDate.getSeconds(),
      dueDate.getMilliseconds()
    );
    let timeValue;
    var delta = Math.floor((Currenttime - dueTimeValue) / 1000);
    if (delta < 60) {
      timeValue = delta + ' sec ';
    }
    // 
    else if (delta < 3600) {
      timeValue = Math.floor(delta / 60) + ' min(s)';
    }
    else if (delta >= 3600 && delta < 86400) {
      timeValue = Math.floor(delta / 3600) + ' hr(s)';
    }
    else {
      timeValue = Math.floor(delta / 86400) + ' day(s)';
    }

    return timeValue;
  }

  //Method For email Validation
  emailValidation(email:string){
    var regexp = new RegExp('/^[a-zA-Z0-9_}{+\-_]+(\.[a-zA-Z0-9_}{+\-_]+)*@[a-zA-Z0-9\-\.]*[a-zA-Z0-9](\.[a-zA-Z0-9\.\-]*[a-zA-Z0-9\.])*[\.][a-zA-Z]{2,63}$/');
    // var atpos = email.indexOf("@");
    // var dotpos = email.lastIndexOf(".");
    console.log(regexp.test(email));
    if (regexp.test(email)) {
        return false;
    }else{
      return true;
    }
  }
}
