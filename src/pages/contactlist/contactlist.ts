import { LocalstorageProvider } from './../../providers/localstorage/localstorage'
import { ContactorcontactlinkPage } from './../contactorcontactlink/contactorcontactlink'
import { ServiceProvider } from './../../providers/service/service'
import { CompanytabPage } from './../companytab/companytab'
import { Component, ViewChild, HostListener } from '@angular/core'
import { DatePipe } from '@angular/common'
import {
  ModalController,
  NavController,
  NavParams,
  MenuController,
  PopoverController,
  Nav,
  Select,
  ViewController,
} from 'ionic-angular'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service'
import { HttpClient } from '@angular/common/http'
import { ContacttabsPage } from '../contacttabs/contacttabs'
import { AddnotePage } from '../addnote/addnote'
import { Content } from 'ionic-angular'
import { Upilotconstants } from '../upilotconstant'
import { ContactordealcreatelinkPage } from '../contactordealcreatelink/contactordealcreatelink'
import { DealtabsPage } from '../dealtabs/dealtabs'
import { AlertController } from 'ionic-angular/components/alert/alert-controller'
import { Keyboard } from '@ionic-native/keyboard'
import { LoginbackgroundprocessProvider } from '../../providers/loginbackgroundprocess/loginbackgroundprocess'
import { PostponePage } from '../postpone/postpone'
import { TaskeditPage } from '../taskedit/taskedit'

//declare var dataLayer: Array<any>;

@Component({
  selector: 'page-contactlist',
  templateUrl: 'contactlist.html',
})
export class ContactlistPage {
  public offsetNumber: any = 0
  public n: number = 0
  // Contact List data
  contactDatas: any
  //TO show loader
  showloader: boolean = false
  showloaderlist: boolean = false
  @ViewChild(Content) content: Content
  // focus the serrch bar
  @ViewChild('searchInputToFocus') searchInputToFocus
  @ViewChild('myselect') select: Select
  clickEvents: any
  // Link for next set of record
  nextLink: any
  //selected filter id to get the next set of data
  selectedFilterId: any

  notifications: boolean = true
  recentlyViewedData = []

  // enable or disable the scroll infinite
  enablePaging: boolean = true

  isRefresh: boolean = false
  //To get triggering for click to remove body class

  hideMe: boolean = true

  @HostListener('document:click', ['$event'])
  //to close the blur class on click of outside for dropdown
  handleClick(event: Event) {
    this.clickEvents = event
    if (this.clickEvents.target.localName == 'ion-backdrop') {
      this.clickOption()
    }
    if (this.removeClass) {
      this.removeClass = false
      const body = document.getElementById('expendblock')
      if (this.hasClass(body, 'agnd_outer_in_pop')) {
        setTimeout(() => {
          body.classList.remove('agnd_outer_in_pop')
        }, 420)
      }
    }
  }
  //header page title
  pageTitle: any
  filterEndpoint: any
  listEndpoint: any
  // deal pipe line stage
  dealPipelineStage: any
  searchData: any
  filtervalueOffset: any
  //get the contact search data Array
  contactSearchData: Array<any> = []
  //get the deal search data Array
  dealSearchData: Array<any> = []
  //get the task search data Array
  taskSearchData: Array<any> = []

  constructor(
    public con: Upilotconstants,
    public modalCtrl: ModalController,
    public nav: Nav,
    public alertCtrl: AlertController,
    private service: ServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public authService: AuthServiceProvider,
    public popoverCtrl: PopoverController,
    public HttpClient: HttpClient,
    public local: LocalstorageProvider,
    public viewCtrl: ViewController,
    private keyboard: Keyboard,
    public loginProcess: LoginbackgroundprocessProvider,
    public datePipe: DatePipe
  ) {
    //Using same html page for all side menu
    let pageFrom = navParams.get('pagefor')
    this.con.closeApp.push(pageFrom)
    if (pageFrom === undefined || pageFrom === this.con.sidemenuLink.contacts) {
      this.pageTitle = this.con.sidemenuLink.contacts
      this.filterEndpoint = this.con.contactfiterEndpoint //Filter end point
      this.listEndpoint = this.con.contactsEndpoint //list end point
    } else if (pageFrom == this.con.sidemenuLink.recentlyviewed) {
      this.pageTitle = pageFrom
    }
    // <!-- (01-06-2020 @Laksh) Commented for notifications stopped  -->
    //this.loginProcess.getNotificationsCount();//Get the count of the notifications

    // bind the updateListPageContent method the updateListPageContent variable to refresh the list content data
    this.con.updateListPageContent = this.updateListPageContent.bind(this)
  }
  options: any
  //contactlist: any;

  withOutFilterContactList: any
  currencyValue: any
  currencyDataValue: any
  totalDealValue: any
  showsupport: boolean = false
  showSearchCoss: boolean = false
  //TO set the search bar value
  searchbarValue: boolean = false
  optionsValue: any
  searchInput: any = ''

  // Get the contact list from api
  getContactListFormApi(filter_val) {
    if (this.con.isContactLoaded == false) {
      this.con.isContactLoaded = true
      this.showloader = true
      this.selectedFilterId = filter_val
      if (!this.isRefresh) {
        this.isRefresh = false
        this.showloader = true
      }
      let formData = new FormData()
      formData.append('filterViewId', filter_val)
      formData.append('limit', this.con.recordlimit)
      formData.append('offset', '0')

      let pageFrom = this.navParams.get('pagefor')

      if (this.showloaderlist == true) {
        this.showloader = false
      }

      //console.log('pageFrom==> '+pageFrom+' <==> '+this.con.sidemenuLink.deals);

      this.authService
        .getPostWithAccessToken(filter_val, formData, this.listEndpoint)
        .then(
          (result) => {
            {
              this.showloader = false
              this.withOutFilterContactList = result.data
              this.con.contactList = this.withOutFilterContactList
              var totalResult = +result.paging.total // String to number

              if (result.data.length == totalResult) {
                this.enablePaging = false
              }
            }

            this.con.isContactLoaded = true
          },
          (err) => {
            this.showloader = false
            this.con.contactList = []
          }
        )
    }
  }

  numFormatter(num, digits) {
    var si = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'k' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'G' },
      { value: 1e12, symbol: 'T' },
      { value: 1e15, symbol: 'P' },
      { value: 1e18, symbol: 'E' },
    ]
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/
    var i
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol
  }

  //To get the dropdown values from api
  filterList() {
    this.showloader = true
    this.authService.getData('', this.filterEndpoint).then(
      (result) => {
        this.options = result.data
        this.con.contactOptions = result.data
        if (this.con.cachedContactlistFilterValue == -111) {
          for (let data of result.data) {
            if (data.isDefault == 1) {
              this.optionsValue = data.filterViewId
              if (this.pageTitle == this.con.sidemenuLink.contacts) {
                this.con.cachedContactlistFilterValue = data.filterViewId
              }
            }
          }
        } else if (
          this.con.cachedContactlistFilterValue >= 0 &&
          this.pageTitle == this.con.sidemenuLink.contacts
        ) {
          this.optionsValue = this.con.cachedContactlistFilterValue
        }

        //this.getContactListFormApi(this.optionsValue);
      },
      (err) => {}
    )
  }

  ///Get the deal pipe line list
  dealPipeStagesList() {
    this.authService.getData('', this.con.dealPipelitsEndpoint).then(
      (result) => {
        this.dealPipelineStage = result
        this.service.setDealPipelineStage(this.dealPipelineStage)
      },
      (err) => {}
    )
  }

  //Get the recently view data

  recentlyViewed() {
    this.showloader = true
    this.authService.getData('', this.con.recentlyViewedEndpoint).then(
      (result) => {
        this.showloader = false
        //  this.recentlyViewedData=result.data;
        for (let data of result.data) {
          data.hideList = false
          data.expanded = false
          this.recentlyViewedData.push(data)
        }
      },
      (err) => {
        this.showloader = false
      }
    )
  }
  //Recently viewd details
  recentlyViewedDetail(data) {
    if (data.type == 'deal') {
      data.id_deal = data.id
      data.deal_name = data.name
      data.party = data.dpName
      this.detailDeals(data, 'history')
    } else if (data.type == 'party') {
      data.id_party = data.id
      if (data.partyType == 1) {
        this.detailContact(data, 'history')
      } else {
        this.detailCompany(data, 'history')
      }
    } else if (data.type == 'task') {
      //  this.navCtrl.push(AgendalistPage, { pagefor: 'Agenda' });
      this.getTaskDetailFormApi(data.id, '')
    }
  }
  ///This method will trigger after view loaded
  ionViewDidLoad() {
    if (this.pageTitle == this.con.sidemenuLink.recentlyviewed) {
      this.recentlyViewed()
    } else {
      this.optionsValue = this.con.cachedContactlistFilterValue
      if (this.con.isContactLoaded == false) {
        this.filterList()
      }
    }
  }

  //Refresh the contact list
  doRefresh(refresher) {
    this.showloaderlist = true
    this.con.isContactLoaded = false
    setTimeout(() => {
      //console.log('Async operation has ended');
      refresher.complete()
    }, 1000)
    this.getContactListFormApi(this.con.cachedContactlistFilterValue)
  }

  //To redirect to contact detail page
  detailContact(contactData, to) {
    // //console.log("contact tab", contactData);

    //this.showloader = true;
    this.service.setLimitData(contactData)
    this.navCtrl.push(ContacttabsPage, { openTab: to })
    //this.showloader = false;
  }
  //To redirect to company detail page
  detailCompany(companyData, openTab) {
    //this.showloader = true;
    this.service.setLimitData(companyData)
    this.navCtrl.push(CompanytabPage, { openTab: openTab })
    //this.showloader = false;
  }

  //To redirect to Deal tabs
  detailDeals(dealData, openTab) {
    // //console.log("deal details page", dealData)

    this.showloader = true
    this.service.setLimitData(dealData)
    //console.log("this.dealData", dealData);
    this.navCtrl.push(DealtabsPage, { openTab: openTab })
    this.showloader = false
  }

  //To show the header dropdown values in header

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(this.options)
    popover.present({
      ev: myEvent,
    })
  }

  //Search the contacts and companies based on name
  getItems(ev: any) {
    let val = ev.target.value

    this.contactSearchData = []
    this.dealSearchData = []
    this.taskSearchData = []

    if (val && val.trim() != '') {
      this.showloader = true
      this.authService.getData('', this.con.globalSearchEndpoint + val).then(
        (result) => {
          this.showloader = false
          //console.log(parseInt(result.data.contacts.numresults), result.data.contacts.numresults);
          if (parseInt(result.data.contacts.numresults) > 0) {
            this.contactSearchData = result.data.contacts.results
          } else {
            this.contactSearchData = []
          }
          //console.log(result.data, this.contactSearchData, 'its me');
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
    } else {
      //  this.showSearchCoss = true;
      this.showloader = false
    }
  }
  //Adding a body class on click of header dropdown
  addBodyClass() {
    const body = document.getElementsByTagName('body')[0]
    body.classList.add('cnt_dpact')
  }

  //on change of the filter list values to get the contacts
  onChangeTime(event) {
    if (this.pageTitle == this.con.sidemenuLink.contacts) {
      this.con.cachedContactlistFilterValue = event
    }
    this.clickOption()
    this.con.offsetRecords = 0
    this.enablePaging = true
    this.offsetNumber = 0
    this.con.isContactLoaded = false

    this.getContactListFormApi(event)
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

  //To show the modal for add new contact or new company
  addNote() {
    //check for internate connection
    if (this.con.isConnected) {
      const profileModal = this.modalCtrl.create(
        ContactorcontactlinkPage,
        {},
        { cssClass: 'modal_exapn_tab' }
      )
      profileModal.present()
    } else {
      //show no internate connection alert
      this.con.alertMessage(this.con.noInternateConnectionMsg)
    }
  }
  dealnote() {
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

  //Removing appended body Class
  removebodyClass() {
    this.clickOption()
  }

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
    //this.con.contactList = this.withOutFilterContactList;
    this.searchbarValue = false
    this.contactSearchData = []
    this.dealSearchData = []
    this.taskSearchData = []
    this.content.resize()
    this.searchInput = ''
  }
  //TO clear the search bar data
  clearSearchBar() {
    setTimeout(() => {
      this.closeSerch()
    }, 100)
  }

  //this methid is used to redirect ti add note page
  movetoAddNotePage() {
    this.navCtrl.push(AddnotePage)
  }
  //TO remove the body class for dropdown when click on outside of the popover or change of the dropdown value
  clickOption() {
    const body = document.getElementsByTagName('body')[0]
    if (this.hasClass(body, 'cnt_dpact')) {
      setTimeout(() => {
        body.classList.remove('cnt_dpact')
      }, 420)
    }
  }

  //Infinite scroll for the list data
  doInfinite(infiniteScroll) {
    //this.offsetNumber +=this.offsetNumber
    this.offsetNumber += +this.con.recordlimit
    // //console.log(this.offsetNumber,'this.con.offsetRecords',this.selectedFilterId);
    let formData = new FormData()
    formData.append('filterViewId', this.selectedFilterId)
    formData.append('limit', this.con.recordlimit)
    formData.append('offset', this.offsetNumber)
    // //console.log(formData);

    let pageFrom = this.navParams.get('pagefor')

    this.authService
      .getPostWithAccessToken(this.optionsValue, formData, this.listEndpoint)
      .then(
        (result) => {
          if (pageFrom == this.con.sidemenuLink.deals) {
            // updated by evolteam, Nov 21st

            // //console.log('result.data.deal_list==>'+result.data.deal_list.length);
            for (var i = 0; i < result.data.deal_list.length; i++) {
              this.con.contactList.push(result.data.deal_list[i])

              if (i + 1 == result.data.deal_list.length) {
                infiniteScroll.complete()
              }
            }
            if (result.data.deal_list.length == 0) {
              infiniteScroll.complete()
            }
            if (result.data.deal_list == '') {
              this.enablePaging = false
            } else if (result.data.deal_list.length < this.con.recordlimit) {
              this.enablePaging = false
            }
          } else {
            for (var i = 0; i < result.data.length; i++) {
              this.con.contactList.push(result.data[i])

              if (i + 1 == result.data.length) {
                infiniteScroll.complete()
              }
            }

            if (result.data.length == 0) {
              infiniteScroll.complete()
            }
            if (result.data == '') {
              //  infiniteScroll.enable(false);
              this.enablePaging = false
            } else if (result.data.length < this.con.recordlimit) {
              //  infiniteScroll.enable(false);
              this.enablePaging = false
            }
          }
        },
        (err) => {
          setTimeout(() => {
            infiniteScroll.enable(false)
          }, 500)
        }
      )
  }

  //TO close the drop down when click of the label
  closeSelect() {
    const body = document.getElementsByTagName('body')[0]
    if (this.hasClass(body, 'cnt_dpact')) {
      this.clickOption()
      this.select.close()
    }
  }

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
  //task overduce class for search data
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

  //Call this method to update the list in case of any update is happening
  updateListPageContent() {
    if (this.pageTitle == this.con.sidemenuLink.contacts) {
      this.isRefresh = true
      this.getContactListFormApi(this.selectedFilterId)
    }
  }

  //******************* Recently View Task Deatils Show Code Started ************************************//
  agendaId: any
  taskData: any
  contactId: any
  showTaskDetail: boolean = false
  // Get the task detail list from api
  getTaskDetailFormApi(agendaId, from) {
    this.authService
    this.agendaId = agendaId
    this.authService
      .getData(agendaId, this.con.taskDetailEndpoint + agendaId)
      .then(
        (result) => {
          this.taskData = result.data
          this.selectItem = result.data
          var _MS_PER_DAY = 1000 * 60 * 60 * 24
          var currentDate = new Date()
          var currentTimeValue = Date.UTC(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
          )

          var dueDate = new Date(this.taskData.task_due_date.replace(/-/g, '/'))
          var dueTimeValue = Date.UTC(
            dueDate.getFullYear(),
            dueDate.getMonth(),
            dueDate.getDate()
          )
          var dayDifference = Math.floor(
            (currentTimeValue - dueTimeValue) / _MS_PER_DAY
          )
          this.taskData.dayDifference = dayDifference
          //get hour from duedate object
          var hours = dueDate.getHours()
          //get minutes from duedate object
          var minutes = dueDate.getMinutes()
          var ampm = hours >= 12 ? 'PM' : 'AM'
          hours = hours % 12
          hours = hours ? hours : 12 // the hour '0' should be '12'
          var min = minutes < 10 ? '0' + minutes : minutes
          //convering date in specfic format
          var strTime =
            this.con.monthArray[dueDate.getMonth()] +
            ' ' +
            dueDate.getDate() +
            ', ' +
            dueDate.getFullYear() +
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
            var ArrayObj = []
            if (this.searchbarValue) {
              ArrayObj = this.taskSearchData
              for (let listItem of ArrayObj) {
                if (this.agendaId == listItem.id_task) {
                  listItem.expanded = !listItem.expanded
                  listItem.hideList = true
                  break
                } else {
                  listItem.hideList = true
                  listItem.expanded = false
                }
              }
            } else {
              ArrayObj = this.recentlyViewedData
              for (let listItem of ArrayObj) {
                if (this.agendaId == listItem.id) {
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

  ///Get the contacts details from api
  getContactFromApi(contactId) {
    //  this.showloader = true;
    this.authService
      .getData(
        contactId,
        this.con.infoEndpoint + contactId + this.con.companyEndpoint
      )
      .then(
        (result) => {
          //  this.showloader = false;
          this.service.setContactDetail(result.data)
        },
        (err) => {}
      )
  }

  removeClass: boolean = false

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
          //    this.getAgendaListFormApi("refresh",this.con.agendaCachedFilter);
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
  selectItem: any
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
        this.getTaskDetailFormApi(this.agendaId, 'refresh')
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
  }
  //refresh the list content after edit info
  updatePageContent() {
    this.getTaskDetailFormApi(this.agendaId, 'refresh')
  }

  // To close the Popup
  openDealOrContactPage(dealData, contactData) {
    if (!this.con.isConnected) {
      this.con.alertMessage(this.con.noInternateConnectionMsg)
      return
    }
    if (dealData != null) {
      this.service.setLimitData(dealData)
      this.navCtrl.push(DealtabsPage)
    } else {
      this.service.setLimitData(contactData)
      this.navCtrl.push(ContacttabsPage)
    }
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
  //closing the expended block
  closeExpending() {
    var ArrayObj = []
    if (this.searchbarValue) {
      ArrayObj = this.taskSearchData
    } else {
      ArrayObj = this.recentlyViewedData
    }
    ArrayObj.map((listItem) => {
      listItem.hideList = false
      listItem.expanded = false
    })
  }
  //Open the task details
  DetailTask(task) {
    this.getTaskDetailFormApi(task.id_task, '')
  }

  //******************* Recently View Task Deatils Show Code END ************************************//
  openCallPage() {}
  openMailPopup() {}

  //geting the first letter of the first name and last name
  dealPartyNameNoimage: any
  nameSpace(name) {
    // //console.log("namespacename", name);
    let format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
    if (name) {
      let sliceName = name.split(' ')
      // //console.log("sliceName.length", sliceName.length);
      if (sliceName.length <= 1) {
        this.dealPartyNameNoimage = sliceName[0].slice(0, 1)
      } else {
        this.dealPartyNameNoimage =
          sliceName[0].slice(0, 1) + sliceName[1].slice(0, 1)
        // //console.log("this.dealPartyNameNoimage5", this.dealPartyNameNoimage)
      }
      // //console.log("end notify", this.notificationNameNoimage);
      return this.dealPartyNameNoimage
    }
  }
}
