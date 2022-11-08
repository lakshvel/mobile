import { LocalstorageProvider } from './../../providers/localstorage/localstorage'
import { ContactorcontactlinkPage } from './../contactorcontactlink/contactorcontactlink'
import { ServiceProvider } from './../../providers/service/service'
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
import { Content } from 'ionic-angular'
import { Upilotconstants } from '../upilotconstant'
import { ContactordealcreatelinkPage } from '../contactordealcreatelink/contactordealcreatelink'
import { DealtabsPage } from '../dealtabs/dealtabs'
import { AlertController } from 'ionic-angular/components/alert/alert-controller'
import { Keyboard } from '@ionic-native/keyboard'
import { LoginbackgroundprocessProvider } from '../../providers/loginbackgroundprocess/loginbackgroundprocess'
import { TaskeditPage } from '../taskedit/taskedit'

//declare var dataLayer: Array<any>;

@Component({
  selector: 'page-deallist',
  templateUrl: 'deallist.html',
})
export class DeallistPage {
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

    if (pageFrom == this.con.sidemenuLink.deals) {
      this.pageTitle = pageFrom
      // this.dealPipeStagesList();
      this.filterEndpoint = this.con.dealfilterEndpoint //filter end point
      this.listEndpoint = this.con.dealslistEndpoint //list end point
    }

    // (01-06-2020 @Laksh) Commented for notifications stopped
    //this.loginProcess.getNotificationsCount();//Get the count of the notifications
  }
  options: any
  //deallist: any;
  withOutFilterDealList: any
  currencyValue: any
  currencyDataValue: any
  totalDealValue: any
  showsupport: boolean = false
  showSearchCoss: boolean = false
  //TO set the search bar value
  searchbarValue: boolean = false
  dealsValue: any
  searchInput: any = ''

  // Get the contact list from api
  getDealListFormApi(filter_val) {
    if (this.con.isDealLoaded == false) {
      this.con.isDealLoaded = true
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
            if (pageFrom == this.con.sidemenuLink.deals) {
              if (result.data.length == 0) {
                result.data.deal_list = []
                result.data.total_deal_value = 0
              }

              if (result.data.deal_list.length != 0) {
                var currencyValue = result.data.deal_list[0].deal_value
                this.con.currencyDataValue = currencyValue.slice(0, 1)
              }
              this.showloader = false
              this.withOutFilterDealList = result.data.deal_list //edited evolteam, result.data 21st Nov
              this.con.dealList = this.withOutFilterDealList

              this.con.totalDealValue = this.numFormatter(
                result.data.total_deal_value,
                2
              )
              var totalResult = +result.paging.total // String to number
              if (result.data.deal_list.length == totalResult) {
                this.enablePaging = false
              }
            } else {
              this.showloader = false
              this.withOutFilterDealList = result.data
              this.con.dealList = this.withOutFilterDealList
              var totalResult = +result.paging.total // String to number
              // //console.log(totalResult," ",result.data.length );
              if (result.data.length == totalResult) {
                this.enablePaging = false
              }
            }

            this.con.isDealLoaded = true
          },
          (err) => {
            this.showloader = false
            this.con.dealList = []
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
        this.con.dealOptions = result.data

        if (this.con.cachedDealsListFilterValue == -111) {
          for (let data of result.data) {
            if (data.isDefault == 1) {
              this.dealsValue = data.filterViewId
              if (this.pageTitle == this.con.sidemenuLink.deals) {
                this.con.cachedDealsListFilterValue = data.filterViewId
              }
            }
          }
        } else if (
          this.con.cachedDealsListFilterValue >= 0 &&
          this.pageTitle == this.con.sidemenuLink.deals
        ) {
          this.dealsValue = this.con.cachedDealsListFilterValue
        }
        //console.log(this.dealsValue, 'dealsvalue')
        //this.getDealListFormApi(this.dealsValue);
      },
      (err) => {}
    )
  }

  ///Get the deal pipe line list
  dealPipeStagesList() {
    this.authService.getData('', this.con.dealPipelitsEndpoint).then(
      (result) => {
        this.dealPipelineStage = result
        this.con.dealPipelineStage = result
        this.service.setDealPipelineStage(this.dealPipelineStage)
      },
      (err) => {}
    )
  }

  ///This method will trigger after view loaded
  ionViewDidLoad() {
    this.dealsValue = this.con.cachedDealsListFilterValue
    //console.log(this.con.dealList, 'is deals list is there')
    if (!this.con.isDealLoaded) {
      this.dealsValue = this.con.cachedDealsListFilterValue
      this.dealPipeStagesList()
      this.filterList()
    }
  }

  //To redirect to Deal tabs
  detailDeals(dealData, openTab) {
    //this.showloader = true;
    this.service.setLimitData(dealData)
    this.navCtrl.push(DealtabsPage, { openTab: openTab })
    //this.showloader = false;
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
          if (parseInt(result.data.contacts.numresults) > 0) {
            this.contactSearchData = result.data.contacts.results
          } else {
            this.contactSearchData = []
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
    } else {
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
    if (this.pageTitle == this.con.sidemenuLink.deals) {
      this.con.cachedDealsListFilterValue = event
    }
    this.clickOption()
    this.con.offsetRecords = 0
    this.enablePaging = true
    this.offsetNumber = 0
    this.con.isDealLoaded = false
    this.getDealListFormApi(event)
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
    // this.con.dealList = this.withOutFilterDealList;
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
      .getPostWithAccessToken(this.dealsValue, formData, this.listEndpoint)
      .then(
        (result) => {
          if (pageFrom == this.con.sidemenuLink.deals) {
            // updated by evolteam, Nov 21st

            // //console.log('result.data.deal_list==>'+result.data.deal_list.length);
            for (var i = 0; i < result.data.deal_list.length; i++) {
              this.con.dealList.push(result.data.deal_list[i])

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
              this.con.dealList.push(result.data[i])

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

  //******************* Recently View Task Deatils Show Code Started ************************************//
  agendaId: any
  taskData: any
  contactId: any
  showTaskDetail: boolean = false
  removeClass: boolean = false

  // trigger to click on the more button
  morOptionButton() {
    setTimeout(() => {
      this.removeClass = true
    }, 200)
    const body = document.getElementById('expendblock')
    body.classList.add('agnd_outer_in_pop')
  }

  selectItem: any

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

  //Refresh the deal list
  doRefresh(refresher) {
    this.showloaderlist = true
    this.con.isDealLoaded = false
    setTimeout(() => {
      //console.log('Async operation has ended');
      refresher.complete()
    }, 1000)
    this.dealPipeStagesList()
    this.getDealListFormApi(this.con.cachedDealsListFilterValue)
  }
}
