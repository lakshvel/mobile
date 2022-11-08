import { Keyboard } from '@ionic-native/keyboard'
import { ServiceProvider } from './../../providers/service/service'
import { Component, ViewChild, HostListener } from '@angular/core'
import {
  ModalController,
  NavController,
  NavParams,
  Select,
  ViewController,
  Events,
} from 'ionic-angular'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service'
import { Content } from 'ionic-angular'
import { Upilotconstants } from '../upilotconstant'
import { Platform } from 'ionic-angular/platform/platform'
import { AlertController } from 'ionic-angular/components/alert/alert-controller'
import { AddnotePage } from '../addnote/addnote'
import { ContactorcompanycallPage } from '../contactorcompanycall/contactorcompanycall'
import { EditcontactinfoPage } from '../editcontactinfo/editcontactinfo'
import { DealtabsPage } from '../dealtabs/dealtabs'
import { ContacttabsPage } from '../contacttabs/contacttabs'
import { PostponePage } from '../postpone/postpone'
import { CompanytabPage } from '../companytab/companytab'
import { DatePipe } from '@angular/common'
import { LoginbackgroundprocessProvider } from '../../providers/loginbackgroundprocess/loginbackgroundprocess'
import { TaskeditPage } from '../taskedit/taskedit'
import { ContactordealcreatelinkPage } from '../contactordealcreatelink/contactordealcreatelink'
import * as moment from 'moment'

//declare var dataLayer: Array<any>;

@Component({
  selector: 'page-agendalist',
  templateUrl: 'agendalist.html',
})
export class AgendalistPage {
  contactDatas: any
  showloader: boolean = true //TO show loader
  @ViewChild(Content) content: Content
  @ViewChild('searchInputToFocus') searchInputToFocus
  @ViewChild('myselect') select: Select
  clickEvents: any
  nextLink: string = 'NoLink'
  prevLink: string = 'NoLink'
  selectedFilterId: any
  agendaList = []
  agendaListWithoutFilter: any
  agendaListWithoutSearch: any
  listEndpoint: any
  infoData: any
  optionsValue: any
  pageTitle: any
  isoverDueForYes = false
  isoverDueForToday = false
  commonObj = []
  contactId: any
  notifications: boolean = true
  agendaFilterListData: any
  searchInput: any = ''

  //To display three tabs while landing into the page with history tab details
  tabDisplay = {
    yesterday: false,
    today: true,
    tomorrow: false,
    overdue: false,
    thisweek: false,
    thismonth: false,
    futuretasks: false,
  }
  dealPipeLine: any
  hideMe: boolean = true
  constructor(
    public con: Upilotconstants,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private service: ServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public platform: Platform,
    public viewCtrl: ViewController,
    private keyboard: Keyboard,
    public datePipe: DatePipe,
    public loginProcess: LoginbackgroundprocessProvider,
    public events: Events
  ) {
    let pageFrom = navParams.get('pagefor')
    this.pageTitle = pageFrom
    this.listEndpoint = this.con.agendaEndpoint
    this.dealPipeLine = this.service.getDealPipelineStage()
    // <!-- (01-06-2020 @Laksh) Commented for notifications stopped  -->
    //loginProcess.getNotificationsCount();
    // //console.log(navigator, 'it is aganda list');
    // //console.log("Contactdealtab", this.limitData.id_party);

    this.events.subscribe('task:taskPublish', (time) => {
      // //console.log('taskPub ========> '+taskPub);
      this.getAgendaListFormApi('direct', this.con.agendaCachedFilter)
      this.getTaskDetailFormApi(this.agendaId, 'refresh')
    })
  }
  //Agenda filter list
  agendaFilterList() {
    this.authService.getData('', this.con.agendaFilterEndpoint).then(
      (result) => {
        this.agendaFilterListData = result.data
        if (this.con.agendaCachedFilter === undefined) {
          for (let opt of result.data) {
            if (opt.isDefault == 1) {
              this.optionsValue = opt.filterViewId
              this.con.agendaCachedFilter = this.optionsValue
              //break;
            }
          }
        } else {
          this.optionsValue = this.con.agendaCachedFilter
          // this.con.agendaCachedFilter=this.optionsValue
        }
        this.getAgendaListFormApi('direct', this.con.agendaCachedFilter)
      },
      (err) => {
        this.showloader = false
      }
    )
  }
  showSearchCoss: boolean = false
  //TO set the search bar value
  searchbarValue: boolean = false
  removeClass: boolean = false

  taskData: any
  agendaId: any
  selectItem: any
  dealPipelineStage = []

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    const body = document.getElementsByTagName('body')[0]
    if (this.removeClass) {
      this.clickOption()
    }
    if (this.hasClass(body, 'cnt_dpact')) {
      this.clickOptionClose()
    }
  }

  // Get the agenda list from api
  getAgendaListFormApi(callstatus, filterValue) {
    if (callstatus == 'direct') {
      this.showloader = true
    }
    let formData = new FormData()
    formData.append('filterViewId', filterValue)
    formData.append('limit', '25')
    this.authService
      .getPostWithAccessToken(filterValue, formData, this.listEndpoint)
      .then(
        (result) => {
          var yesterday = []
          var today = []
          var tomorrow = []
          var overdue = []
          var thisweek = []
          var thismonth = []
          var futuretasks = []
          var _MS_PER_DAY = 1000 * 60 * 60 * 24
          //var currentDate = new Date();
          var currentDate = moment.utc()
          var currentDate1 = moment(
            currentDate.format('YYYY-MM-DD'),
            'YYYY-MM-DD'
          )
          // var currentTimeValue = Date.UTC(
          //   currentDate.getFullYear(),
          //   currentDate.getMonth(),
          //   currentDate.getDate()
          // );

          //console.log("agenda result.data", (new Date()).getTimezoneOffset(), moment().utcOffset(), moment().zone(), moment().format('z'), moment().format('Z'), moment().format('ZZ'));

          moment().utcOffset(moment().format('Z'))

          ////console.log(moment().utcOffset(), 'test ils');

          for (var value of result.data) {
            // var dueDate = new Date(value.task_due_date.replace(/-/g, "/")+' UTC');
            // var endDate = new Date(value.task_end_date.replace(/-/g, "/")+' UTC');

            var dueDateUTC = moment.utc(value.task_due_date).toDate()
            var dueDate = moment(dueDateUTC).local()
            var dueDate11 = moment(
              moment(value.task_due_date).format('YYYY-MM-DD'),
              'YYYY-MM-DD'
            )

            var endDateUTC = moment.utc(value.task_end_date).toDate()
            var endDate = moment(endDateUTC).local()

            var dueDate1 = new Date(
              value.task_due_date.replace(/-/g, '/') + ' '
            )
            var endDate1 = new Date(
              value.task_end_date.replace(/-/g, '/') + ' '
            )

            //console.log("dueDate", dueDate, dueDate1);
            //console.log("endDate", endDate, endDate1);
            // var dueTimeValue = Date.UTC(
            //   dueDate.getFullYear(),
            //   dueDate.getMonth(),
            //   dueDate.getDate()
            // );
            var dayDifference1 = moment.duration(
              dueDate11.diff(currentDate1),
              'days'
            ) //endDate.diff(dueDate, 'days');
            var dayDifference = dayDifference1.days()

            //Math.floor(
            //   (currentTimeValue - dueTimeValue) / _MS_PER_DAY
            // );

            // //console.log(moment(dueDate).isAfter(moment().endOf('month')), moment(dueDate).isBetween(moment(), moment().endOf('month')), moment(dueDate).isBetween(moment().startOf('week'), moment().endOf('week')),   moment().startOf('week'), moment().endOf('week'),  'today laksh man')

            //console.log("Task List", result.data, dayDifference1, dayDifference, dueDate11, currentDate1);

            // if(moment(dueDate).isBetween(moment().startOf('week'), moment().endOf('week'))) {
            //   thisweek.push(value);
            // }

            // if(moment(dueDate).isBetween(moment(), moment().endOf('month'))) {
            //   thismonth.push(value);
            // }

            // if(moment(dueDate).isAfter(moment().endOf('month'))) {
            //   futuretasks.push(value);
            // }

            var hours = dueDate.hours()
            //console.log("hours", hours);

            var minutes = dueDate.minutes()
            //console.log("minutes", minutes);
            var ampm = hours >= 12 ? 'PM' : 'AM'
            hours = hours % 12
            hours = hours ? hours : 12 // the hour '0' should be '12'
            var min = minutes < 10 ? '0' + minutes : minutes
            var strTime = hours + ':' + min

            value.amOrpm = ampm
            value.strTime = strTime
            //console.log("value.amOrpm", value.amOrpm);
            //console.log("value.strTime", value.strTime);
            value.month = this.con.monthArray[dueDate.months()]
            value.date = dueDate.date()
            value.hideList = false
            //
            if (callstatus != 'direct' && value.id_task == this.agendaId) {
              value.expanded = true
            } else {
              value.expanded = false
            }
            this.agendaListWithoutSearch = result.data

            //task is belong to yesterday
            // if (dayDifference == 1) {
            //   if (
            //     dueDate <= currentDate &&
            //     value.task_status != 2 &&
            //     value.task_status != 3
            //   ) {
            //     this.isoverDueForYes = true;
            //     value.isoverDueForYes = true;
            //   } else {
            //     value.isoverDueForYes = false;
            //   }
            //   overdue.push(value);
            //   //task is belong to Today
            // } else
            if (dayDifference == 0) {
              //task is running now or not
              if (dueDate <= currentDate && currentDate <= endDate) {
                value.isNow = true
              } else {
                value.isNow = false
              }
              value.isToday = true
              //ckeck overdue for today task
              if (
                dueDate <= currentDate &&
                value.task_status != 2 &&
                value.task_status != 3
              ) {
                this.isoverDueForToday = true
                value.isoverDueForToday = true
              } else {
                value.isoverDueForToday = false
              }
              today.push(value)
              //task is belong to Tomorrow
            } else if (dayDifference > 0) {
              value.isToday = false

              today.push(value)
              //task is belong to overdue
            } else if (dayDifference < 0) {
              if (
                dueDate <= currentDate &&
                value.task_status != 2 &&
                value.task_status != 3
              ) {
                if (dayDifference == 0) {
                  value.isToday = true
                } else {
                  value.isToday = false
                }
                overdue.push(value)
              }
            }
          }

          // this.agendaListWithoutSearch = this.agendaListWithoutFilter
          // //console.log("agendaListWithoutFilter", this.agendaListWithoutFilter)
          this.agendaListWithoutFilter = {
            yesterday: yesterday,
            today: today,
            tomorrow: tomorrow,
            overdue: overdue,
            thisweek: thisweek,
            thismonth: thismonth,
            futuretasks: futuretasks,
          }

          if (this.tabDisplay.overdue) {
            this.openEXpending('overdue')
          } else if (this.tabDisplay.today) {
            this.openEXpending('today')
          } else if (this.tabDisplay.tomorrow) {
            this.openEXpending('tomorrow')
          } else if (this.tabDisplay.yesterday) {
            this.openEXpending('yesterday')
          } else if (this.tabDisplay.thisweek) {
            this.openEXpending('thisweek')
          } else if (this.tabDisplay.thismonth) {
            this.openEXpending('thismonth')
          } else if (this.tabDisplay.futuretasks) {
            this.openEXpending('futuretasks')
          }

          this.showloader = false
          if (result.paging.hasOwnProperty('next')) {
            this.nextLink = result.paging.next
          }
        },
        (err) => {
          this.showloader = false
        }
      )
  }
  agendaListChange(filterValue) {
    this.con.agendaCachedFilter = filterValue
    this.getAgendaListFormApi('direct', this.con.agendaCachedFilter)
  }
  getResponse: boolean = false
  // Get the task detail list from api
  getTaskDetailFormApi(agendaId, from) {
    this.authService
    this.agendaId = agendaId
    this.authService
      .getData(agendaId, this.con.taskDetailEndpoint + agendaId)
      .then(
        (result) => {
          ////console.log("Task Details", result.data);
          this.getResponse = true
          this.taskData = result.data
          ////console.log(this.taskData);
          var _MS_PER_DAY = 1000 * 60 * 60 * 24
          //var currentDate = new Date();
          var currentDate = moment.utc()
          // var currentTimeValue = Date.UTC(
          //   currentDate.getFullYear(),
          //   currentDate.getMonth(),
          //   currentDate.getDate()
          // );

          // var dueDate = new Date(
          //   // this.taskData.task_due_date.replace(/-/g, "/")+' UTC'
          //   this.taskData.task_due_date.replace(/-/g, "/")+' '
          // );
          moment().utcOffset(moment().format('Z'))

          var dueDateUTC = moment.utc(this.taskData.task_due_date).toDate()
          var dueDate = moment(dueDateUTC).local()

          // var dueTimeValue = Date.UTC(
          //   dueDate.getFullYear(),
          //   dueDate.getMonth(),
          //   dueDate.getDate()
          // );

          // var dayDifference = Math.floor(
          //   (currentTimeValue - dueTimeValue) / _MS_PER_DAY
          // );

          var dayDifference1 = moment.duration(currentDate.diff(dueDate)) //endDate.diff(dueDate, 'days');
          var dayDifference = dayDifference1.days()
          //console.log(dayDifference, dueDate, currentDate, 'laksh and gunnet')
          this.taskData.dayDifference = dayDifference
          //get hour from duedate object
          var hours = dueDate.hours()
          //get minutes from duedate object
          var minutes = dueDate.minutes()
          var ampm = hours >= 12 ? 'PM' : 'AM'
          hours = hours % 12
          hours = hours ? hours : 12 // the hour '0' should be '12'
          var min = minutes < 10 ? '0' + minutes : minutes
          //convering date in specfic format
          var strTime =
            this.con.monthArray[dueDate.months()] +
            ' ' +
            dueDate.date() +
            ', ' +
            dueDate.years() +
            '-' +
            hours +
            ':' +
            min +
            ampm

          this.taskData.strTime = strTime
          //check task is overdue or not
          //condition if overdue 2-Done, 3-cancel
          if (
            dueDate <= currentDate &&
            this.taskData.task_status != 2 &&
            this.taskData.task_status != 3
          ) {
            this.taskData.isoverDue = true
          } else {
            this.taskData.isoverDue = false
          }

          if (
            this.taskData.deal != null &&
            this.taskData.deal.hasOwnProperty('num_stages')
          ) {
            this.dealPipelineStage = []
            for (var i = 1; i <= this.taskData.deal.num_stages; i++) {
              this.dealPipelineStage.push(i)
            }
          }
          if (
            this.taskData.contact != null &&
            this.taskData.contact.hasOwnProperty('id_party')
          ) {
            this.contactId = this.taskData.contact.id_party
            this.getContactFromApi(this.contactId)
          }
          if (from != 'refresh') {
            if (this.searchbarValue) {
              for (let listItem of this.taskSearchData) {
                if (this.agendaId == listItem.id_task) {
                  listItem.expanded = !listItem.expanded
                  //  listItem.hideList = true;
                  break
                } else {
                  //  listItem.hideList = true;
                  listItem.expanded = false
                }
              }
            } else {
              for (let listItem of this.agendaList) {
                if (this.agendaId == listItem.id_task) {
                  listItem.expanded = !listItem.expanded
                  listItem.hideList = true
                  break
                } else {
                  listItem.hideList = true
                  listItem.expanded = false
                }
              }
            }
          }
          this.showloader = false
        },
        (err) => {
          this.showloader = false
        }
      )
  }

  //expend the component
  expandItem(item, day) {
    this.selectItem = item
    if (!item.expanded) {
      this.getTaskDetailFormApi(item.id_task, 'direct')
    } else {
      this.agendaList.map((listItem) => {
        if (item == listItem) {
          listItem.expanded = !listItem.expanded
        } else {
          listItem.expanded = false
        }

        return listItem
      })
    }
  }
  // updating the data based on the current tab
  openEXpending(day) {
    this.commonObj = []
    this.agendaList = []
    switch (day) {
      case 'today':
        this.commonObj = this.agendaListWithoutFilter.today
        this.agendaList = this.commonObj
        break
      case 'tomorrow':
        this.commonObj = this.agendaListWithoutFilter.tomorrow
        this.agendaList = this.commonObj
        break
      case 'yesterday':
        this.commonObj = this.agendaListWithoutFilter.yesterday
        this.agendaList = this.commonObj
        break
      case 'overdue':
        this.commonObj = this.agendaListWithoutFilter.overdue
        this.agendaList = this.commonObj
        break
      case 'thisweek':
        this.commonObj = this.agendaListWithoutFilter.thisweek
        this.agendaList = this.commonObj
        break
      case 'thismonth':
        this.commonObj = this.agendaListWithoutFilter.thismonth
        this.agendaList = this.commonObj
        break
      case 'futuretasks':
        this.commonObj = this.agendaListWithoutFilter.futuretasks
        this.agendaList = this.commonObj
        break

      default:
        break
    }
  }

  //closing the expended block
  closeExpending() {
    if (this.searchbarValue) {
      this.taskSearchData.map((listItem) => {
        listItem.hideList = false
        listItem.expanded = false
      })
    } else {
      this.agendaList.map((listItem) => {
        listItem.hideList = false
        listItem.expanded = false
      })
    }
  }

  // trigger to click on the more button
  morOptionButton() {
    setTimeout(() => {
      this.removeClass = true
    }, 200)
    const body = document.getElementById('expendblock')
    body.classList.add('agnd_outer_in_pop')
  }

  // update the task to done
  updateTaskStatusDone(id_task) {
    if (!this.con.isConnected) {
      this.con.alertMessage(this.con.noInternateConnectionMsg)
      return
    }

    let formData = new FormData()
    this.authService
      .getPostWithAccessToken(
        '',
        formData,
        this.con.taskDetailEndpoint + id_task + this.con.taskstatusDoneEndpoint
      )
      .then(
        (result) => {
          //display the alert message
          this.con.alertMessage(result.message)
          //call the task detail method for refershing the expended block
          this.getTaskDetailFormApi(this.agendaId, 'refresh')
          //call the task detail method for refershing the list
          this.getAgendaListFormApi('refresh', this.con.agendaCachedFilter)
          //stop the loader
          this.showloader = false
        },
        (err) => {
          this.showloader = false
        }
      )
  }

  //update the task to cancel status
  updateTaskStatusCancel(id_task) {
    // check internet connectivity
    if (!this.con.isConnected) {
      this.con.alertMessage(this.con.noInternateConnectionMsg)
      return
    }
    let formData = new FormData()
    this.authService
      .getPostWithAccessToken(
        '',
        formData,
        this.con.taskDetailEndpoint +
          id_task +
          this.con.taskstatusCancelEndpoint
      )
      .then(
        (result) => {
          //call the task detail method for refershing the expended block
          this.getTaskDetailFormApi(this.agendaId, 'refresh')
          //call the task detail method for refershing the list
          this.getAgendaListFormApi('refresh', this.con.agendaCachedFilter)
          //display the alert message
          this.con.alertMessage(result.message)
          //stop the loader
          this.showloader = false
        },
        (err) => {
          this.showloader = false
        }
      )
  }
  //update the task status to postpone
  updateTaskStatusPostpone(id_task) {
    // check internet connectivity
    if (!this.con.isConnected) {
      this.con.alertMessage(this.con.noInternateConnectionMsg)
      return
    }
    //open postpone model
    const profileModal = this.modalCtrl.create(
      PostponePage,
      {
        selectItem: this.selectItem,
        update: this.updatePageContent.bind(this),
      },
      { cssClass: 'modal_exapn_tab' }
    )
    profileModal.present()
    //trigger when model is close
    profileModal.onDidDismiss((data) => {
      if (data) {
        this.getAgendaListFormApi('refresh', this.con.agendaCachedFilter)
      }
    })
  }

  // To close the Popup
  openAddNotePage() {
    if (!this.con.isConnected) {
      this.con.alertMessage(this.con.noInternateConnectionMsg)
      return
    }
    const body = document.getElementsByTagName('body')[0]
    body.classList.add('blur_pop_up')
    const profileModal = this.modalCtrl.create(
      AddnotePage,
      {
        from: 'agenda',
        Id: this.agendaId,
        update: this.updatePageContent.bind(this),
      },
      { cssClass: 'modal_exapn_tab' }
    )
    profileModal.present()
    this.viewCtrl.dismiss()
  }

  updatePageContent() {
    this.getTaskDetailFormApi(this.agendaId, 'refresh')
  }

  updatepageList() {
    this.getAgendaListFormApi('direct', this.con.agendaCachedFilter)
  }

  // To close the Popup
  openDealOrContactPage(dealData, contactData) {
    if (!this.con.isConnected) {
      this.con.alertMessage(this.con.noInternateConnectionMsg)
      return
    }
    ////console.log("dealdata agenda", dealData);
    // //console.log(contactData);
    if (dealData != null) {
      // //console.log(dealData);
      //this.service.setLimitData(dealData);
      this.detailDeals(dealData, 'history')
      //this.navCtrl.push(DealtabsPage);
    } else {
      this.service.setLimitData(contactData)
      this.navCtrl.push(ContacttabsPage)
    }
  }

  // To close the Popup
  openCallPage() {
    if (!this.con.isConnected) {
      this.con.alertMessage(this.con.noInternateConnectionMsg)
      return
    }
    if (this.contactId === undefined) {
      this.con.alertMessage(this.con.noContactMsg)
    } else {
      this.getInfoFromApi(this.contactId)
    }
  }

  // To close the Popup
  openMailPopup() {
    if (!this.con.isConnected) {
      this.con.alertMessage(this.con.noInternateConnectionMsg)
      return
    }
    if (
      this.taskData.contact != null &&
      this.taskData.contact.hasOwnProperty('email') &&
      this.taskData.contact.email.length > 0
    ) {
      open('mailto:' + this.taskData.contact.email[0].email_id, '_system')
    } else {
      this.con.alertMessage(this.con.noMailMsg)
    }
  }

  noDataForContact = {
    data: {
      info: {},
      contacts: [],
      deals: [],
    },
  }

  ///Get the contacts details from api
  getContactFromApi(contactId) {
    //  this.showloader = true;
    this.authService
      .getData(contactId, 'contact/' + contactId + '/company')
      .then(
        (result) => {
          //  this.showloader = false;
          this.service.setContactDetail(result.data)
        },
        (err) => {
          //  this.showloader = false;
          this.service.setContactDetail(this.noDataForContact.data)
        }
      )
  }

  //Get the contact info from api
  getInfoFromApi(contactId) {
    this.showloader = true
    this.authService
      .getData(contactId, this.con.agendaContactEndpoint + contactId)
      .then(
        (result) => {
          this.showloader = false
          this.infoData = result.data
          if (result.data.phones != null && result.data.phones.length > 0) {
            this.service.setInfoData(result.data)

            let contactCall = this.modalCtrl.create(
              ContactorcompanycallPage,
              { from: 'contact' },
              { cssClass: 'modal_exapn_tab' }
            )
            contactCall.present()
          } else {
            this.noContacts()
          }
        },
        (err) => {
          this.showloader = false
        }
      )
  }
  //trigger no number is related to the contract/deal
  noContacts() {
    const body = document.getElementsByTagName('body')[0]
    body.classList.add('alert_change')
    let alert = this.alertCtrl.create({
      message: this.con.noContact,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            body.classList.remove('alert_change')
          },
        },
        {
          text: 'Add one',
          handler: () => {
            this.editContactInfo()
            body.classList.remove('alert_change')
          },
        },
      ],
    })
    alert.present()
  }

  //To redirect to company edit info page
  editContactInfo() {
    //check for internate connection
    if (this.con.isConnected) {
      const profileModal = this.modalCtrl.create(
        EditcontactinfoPage,
        {
          infoData: this.infoData,
          pageName: 'addphonePopup',
          from: 'company',
          update: this.updatePageContent.bind(this),
        },
        { cssClass: 'modal_exapn_tab' }
      )
      profileModal.present()
    } else {
      //show no internate connection alert
      this.con.alertMessage(this.con.noInternateConnectionMsg)
    }
  }

  //tabs and related active tab data while display based on the conditions
  changeTab(tabName) {
    this.openEXpending(tabName)
    switch (tabName) {
      case 'yesterday':
        this.tabDisplay = {
          yesterday: true,
          today: false,
          tomorrow: false,
          overdue: false,
          thisweek: false,
          thismonth: false,
          futuretasks: false,
        }
        break
      case 'today':
        this.tabDisplay = {
          yesterday: false,
          today: true,
          tomorrow: false,
          overdue: false,
          thisweek: false,
          thismonth: false,
          futuretasks: false,
        }
        break
      case 'tomorrow':
        this.tabDisplay = {
          yesterday: false,
          today: false,
          tomorrow: true,
          overdue: false,
          thisweek: false,
          thismonth: false,
          futuretasks: false,
        }
        break
      case 'overdue':
        this.tabDisplay = {
          yesterday: false,
          today: false,
          tomorrow: false,
          overdue: true,
          thisweek: false,
          thismonth: false,
          futuretasks: false,
        }
        break
      case 'thisweek':
        this.tabDisplay = {
          yesterday: false,
          today: false,
          tomorrow: false,
          overdue: false,
          thisweek: true,
          thismonth: false,
          futuretasks: false,
        }
        break
      case 'thismonth':
        this.tabDisplay = {
          yesterday: false,
          today: false,
          tomorrow: false,
          overdue: false,
          thisweek: false,
          thismonth: true,
          futuretasks: false,
        }
        break
      case 'futuretasks':
        this.tabDisplay = {
          yesterday: false,
          today: false,
          tomorrow: false,
          overdue: false,
          thisweek: false,
          thismonth: false,
          futuretasks: true,
        }
        break
    }
  }

  //Runs when the page has loaded. This event only happens
  //once per page being created.
  ionViewDidLoad() {
    this.agendaFilterList()
  }
  searchData: any

  contactSearchData: Array<any> = []
  dealSearchData: Array<any> = []
  taskSearchData: Array<any> = []
  //Search the contacts and companies based on name
  getItems(ev: any) {
    let val = ev.target.value

    if (val && val.trim() != '') {
      this.showloader = true
      this.authService.getData('', this.con.globalSearchEndpoint + val).then(
        (result) => {
          this.contactSearchData = []
          this.dealSearchData = []
          this.taskSearchData = []
          this.showloader = false
          if (
            result.data.contacts.results != '' &&
            result.data.contacts.results != null
          ) {
            this.contactSearchData = result.data.contacts.results
          }
          if (
            result.data.deals.results != '' &&
            result.data.deals.results != null
          ) {
            this.dealSearchData = result.data.deals.results
          }
          if (
            result.data.tasks.results != '' &&
            result.data.tasks.results != null
          ) {
            //  this.taskSearchData = result.data.tasks.results;
            for (let data of result.data.tasks.results) {
              data.hideList = false
              data.expanded = false
              var dueDate = new Date(data.task_due_date.replace(/-/g, '/'))
              data.month = this.con.monthArray[dueDate.getMonth()]
              data.date = dueDate.getDate()
              this.taskSearchData.push(data)
            }
          }
        },
        (err) => {
          this.showloader = false
        }
      )
    }
  }

  //Adding a body class on click of header dropdown
  addBodyClass() {
    const body = document.getElementsByTagName('body')[0]
    body.classList.add('cnt_dpact')
  }

  // To fix the searchbar and to resize header with font
  onScroll(event) {
    const body = document.getElementsByTagName('body')[0]
    if (event.scrollTop > 50) {
      body.classList.add('srl_str')
    } else {
      body.classList.remove('srl_str')
    }
    //To resize the ion content dynamiclly
    if (event.scrollTop == 0) {
      setTimeout(() => {
        this.content.resize()
      }, 150)
    }
    this.content.resize()
  }

  //Removing appended body Class
  removebodyClass() {}

  //Removing appended body Class
  removeContentClass() {
    setTimeout(() => {
      this.closeSerch()
    }, 100)
  }

  //Cheking required class present or not
  hasClass(ele, cls) {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
  }

  //Resize the content list while scrolling
  scrollStart(event) {
    setTimeout(() => {
      this.content.resize()
    }, 200)
  }

  //To push search bar to top
  openSearchBar() {
    const body = document.getElementsByTagName('body')[0]
    body.classList.add('srch_opn_body')
    const ion_content = document.getElementsByClassName('bg_image')[0]
    ion_content.classList.add('srch_opn')
    this.showSearchCoss = true
    this.searchbarValue = true
    this.getResponse = false
    this.content.resize()
    setTimeout(() => {
      this.searchInputToFocus.setFocus()
    }, 100)
    this.searchInput = ''
  }

  //To close the search bar
  closeSerch() {
    //this.keyboard.close();
    const body = document.getElementsByTagName('body')[0]
    body.classList.remove('srch_opn_body')
    const ion_content = document.getElementsByClassName('bg_image')[0]
    ion_content.classList.remove('srch_opn')
    this.agendaList = this.commonObj
    this.searchbarValue = false
    this.content.resize()
    this.contactSearchData = []
    this.dealSearchData = []
    this.taskSearchData = []
    this.searchInput = ''
  }
  //TO clear the search bar data
  clearSearchBar() {
    setTimeout(() => {
      this.closeSerch()
    }, 100)
  }

  closeSelect() {
    const body = document.getElementsByTagName('body')[0]
    if (this.hasClass(body, 'cnt_dpact')) {
      this.clickOptionClose()
      this.select.close()
    }
  }

  //TO remove the body class for dropdown when click on outside of the popover or change of the dropdown value
  clickOption() {
    const body = document.getElementById('expendblock')
    this.removeClass = false
    if (this.hasClass(body, 'agnd_outer_in_pop')) {
      setTimeout(() => {
        body.classList.remove('agnd_outer_in_pop')
      }, 420)
    }
  }
  clickOptionClose() {
    const body = document.getElementsByTagName('body')[0]
    if (this.hasClass(body, 'cnt_dpact')) {
      setTimeout(() => {
        body.classList.remove('cnt_dpact')
      }, 420)
    }
  }
  // get the current time value
  currentDate = new Date()
  currentTimeValue = Date.UTC(
    this.currentDate.getFullYear(),
    this.currentDate.getMonth(),
    this.currentDate.getDate(),
    this.currentDate.getHours(),
    this.currentDate.getMinutes(),
    this.currentDate.getSeconds(),
    this.currentDate.getMilliseconds()
  )

  dateDispaly(dueDate, taskStatus) {
    let ClassName: string
    var dueDates = new Date(dueDate.replace(/-/g, '/'))
    if (dueDates <= this.currentDate && taskStatus != 2 && taskStatus != 3) {
      ClassName = 'agn_time due_tm_color'
    } else if (taskStatus == 2) {
      ClassName = 'agn_time tod_tm_color'
    } else {
      ClassName = 'agn_time'
    }
    return ClassName
  }

  //To redirect to contact detail page
  detailContact(contactData, openTab) {
    this.showloader = true
    this.service.setLimitData(contactData)
    this.navCtrl.push(ContacttabsPage, { openTab: openTab })
    this.showloader = false
  }
  //To redirect to company detail page
  detailCompany(companyData, openTab) {
    this.showloader = true
    this.service.setLimitData(companyData)
    this.navCtrl.push(CompanytabPage, { openTab: openTab })
    this.showloader = false
  }

  //To redirect to Deal tabs
  detailDeals(dealData, openTab) {
    //console.log('i am agenda list', dealData);
    this.showloader = true
    this.getDealFromApi(dealData.id_deal)
    // this.service.setLimitData(dealData);

    this.showloader = true
    this.authService
      .getData(dealData.id_deal, this.con.dealDetailEndpoint + dealData.id_deal)
      .then(
        (result) => {
          //console.log("result.data", result.data);
          this.con.dealID = result.data.id_deal
          this.con.dealName = result.data.deal_name // evol tech 13 Mar 2019
          // this.dealData = result.data;
          this.service.setLimitData(result.data)

          //this.service.setInfoData(result.data);
          // this.service.setStakeholderList(result.data.stakeHldList);
          this.navCtrl.push(DealtabsPage, { openTab: openTab })
          this.showloader = false
        },
        (err) => {
          this.showloader = false
        }
      )

    this.showloader = false
  }

  ///Get the deal details from api
  getDealFromApi(dealId) {
    this.showloader = true
    this.authService.getData(dealId, this.con.dealDetailEndpoint + dealId).then(
      (result) => {
        //console.log("result.data", result.data);
        this.con.dealID = result.data.id_deal
        this.con.dealName = result.data.deal_name // evol tech 13 Mar 2019
        // this.dealData = result.data;
        this.service.setLimitData(result.data)

        //this.service.setInfoData(result.data);
        // this.service.setStakeholderList(result.data.stakeHldList);

        this.showloader = false
      },
      (err) => {
        this.showloader = false
      }
    )
  }

  //Open edit task modal
  taskEdit(data) {
    const profileModal = this.modalCtrl.create(
      TaskeditPage,
      { task: data },
      { cssClass: 'modal_exapn_tab notifiations' }
    )
    profileModal.present()
  }
  //OPen the options to create
  openCreateOptions() {
    if (this.con.isConnected) {
      const profileModal = this.modalCtrl.create(
        ContactordealcreatelinkPage,
        {},
        { cssClass: 'modal_exapn_tab' }
      )
      profileModal.present()
    } else {
      //show no internate connection alert
      this.con.alertMessage(this.con.noInternateConnectionMsg)
    }
  }

  DetailTaskFromSearch(task) {
    //task.expanded = true;
    this.getTaskDetailFormApi(task.id_task, '')
  }

  //geting the first letter of the first name and last name
  notificationNameNoimage: any
  nameSpace(name) {
    // //console.log("namespacename", name);
    let format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
    if (name) {
      let sliceName = name.split(' ')
      // //console.log("sliceName.length", sliceName.length);
      if (sliceName.length <= 1) {
        this.notificationNameNoimage = sliceName[0].slice(0, 1)
        // //console.log("this.notificationNameNoimage1", this.notificationNameNoimage);
        if (sliceName[1].match(format)) {
          this.notificationNameNoimage = sliceName[0].slice(0, 1)
          // //console.log("this.notificationNameNoimage2", this.notificationNameNoimage)
        } else {
          this.notificationNameNoimage =
            sliceName[0].slice(0, 1) + sliceName[1].slice(0, 1)
          // //console.log("this.notificationNameNoimage3", this.notificationNameNoimage)
        }
      } else {
        if (sliceName[1].match(format)) {
          this.notificationNameNoimage = sliceName[0].slice(0, 1)
          // //console.log("this.notificationNameNoimage2", this.notificationNameNoimage)
        } else {
          this.notificationNameNoimage =
            sliceName[0].slice(0, 1) + sliceName[1].slice(0, 1)
          // //console.log("this.notificationNameNoimage3", this.notificationNameNoimage)
        }
      }
      // //console.log("end notify", this.notificationNameNoimage);
      return this.notificationNameNoimage
    }
  }
}
