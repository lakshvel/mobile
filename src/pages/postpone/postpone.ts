import { Component } from "@angular/core";
import * as moment from 'moment';

import {
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";
import { Upilotconstants } from "../upilotconstant";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

@Component({
  selector: "page-postpone",
  templateUrl: "postpone.html"
})
export class PostponePage {
  weekDay = [];
  updatePageContent: any;
  selectItem: any;
  refreshList: boolean = false;
  //TO show loader
  showloader: boolean = false;

  constructor(
    public con: Upilotconstants,
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public viewCtrl: ViewController
  ) {
    this.selectItem = navParams.get("selectItem");
    this.updatePageContent = this.navParams.get("update");//To calling agenda list method to refresh the page 
  }

  ionViewDidLoad() {
    this.getWeekDays();
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('blur_pop_up');
  }
  //get the week days based on current date
  getWeekDays() {
    var ranges_same_day_next_week	= {};
    let date = new Date();
    var _day_number:any					= moment(date).format('d');
  //  var _in_2_days_day				= moment().add(2, 'day').format('dddd');
  //  var _in_3_days_day				= moment().add(3, 'day').format('dddd');

    if (_day_number <= 4) {
      // From monday to thursday
      ranges_same_day_next_week['Today']			= [moment(), moment()];
      ranges_same_day_next_week['Tomorrow']		= [moment().add(1, 'day'), moment().add(1, 'day')];
    }

    if (_day_number == 1) {
      // Monday
      ranges_same_day_next_week['Wednesday']		= [moment().add(2, 'day'), moment().add(2, 'day')];
      ranges_same_day_next_week['Thursday']		= [moment().add(3, 'day'), moment().add(3, 'day')];
      ranges_same_day_next_week['Friday']			= [moment().add(4, 'day'), moment().add(4, 'day')];
    } else if (_day_number == 2) {
      // Tuesday
      ranges_same_day_next_week['Thursday']		= [moment().add(2, 'day'), moment().add(2, 'day')];
      ranges_same_day_next_week['Friday']			= [moment().add(3, 'day'), moment().add(3, 'day')];
      ranges_same_day_next_week['Monday']			= [moment().add(1, 'week').weekday(1), moment().add(1, 'week').weekday(1)]; // Next monday
    } else if (_day_number == 3) {
      // Wednesday
      ranges_same_day_next_week['Friday']			= [moment(), moment().add(2, 'day')];
      ranges_same_day_next_week['Next Monday']	= [moment().add(1, 'week').weekday(1), moment().add(1, 'week').weekday(1)]; // Next monday
    } else if (_day_number == 4) {
      // Thursday
      ranges_same_day_next_week['Next Monday']	= [moment().add(1, 'week').weekday(1), moment().add(1, 'week').weekday(1)]; // Next monday
      ranges_same_day_next_week['Next Tuesday']	= [moment().add(1, 'week').weekday(2), moment().add(1, 'week').weekday(2)]; // Next tuesday
    } else if (_day_number == 5) {
      // Friday
      ranges_same_day_next_week['Today']			= [moment(), moment()];
      ranges_same_day_next_week['Next Monday']	= [moment().add(1, 'week').weekday(1), moment().add(1, 'week').weekday(1)]; // Next monday
      ranges_same_day_next_week['Next Tuesday']	= [moment().add(1, 'week').weekday(2), moment().add(1, 'week').weekday(2)]; // Next tuesday
      ranges_same_day_next_week['Next Wednesday']	= [moment().add(1, 'week').weekday(3), moment().add(1, 'week').weekday(3)]; // Next wednesday
    } else if (_day_number == 6 || _day_number == 7) {
      // Saturday or Sunday
      ranges_same_day_next_week['Next Monday']	= [moment().add(1, 'week').weekday(1), moment().add(1, 'week').weekday(1)]; // Next monday
      ranges_same_day_next_week['Next Tuesday']	= [moment().add(1, 'week').weekday(2), moment().add(1, 'week').weekday(2)]; // Next tuesday
      ranges_same_day_next_week['Next Wednesday']	= [moment().add(1, 'week').weekday(3), moment().add(1, 'week').weekday(3)]; // Next wednesday
      ranges_same_day_next_week['Next Thursday']	= [moment().add(1, 'week').weekday(4), moment().add(1, 'week').weekday(4)]; // Next thursday
    }

    ranges_same_day_next_week['Next ' + moment().format('dddd')] = [moment().add(1, 'week'), moment().add(1, 'week')];


    var date_raw	= this.selectItem.task_due_date;//Pass the due date from response
    for ( var k in ranges_same_day_next_week )
    {
            var datevalue = ranges_same_day_next_week[k][1];
            var taskdate = moment(date_raw);
            datevalue = datevalue.hours(0).minutes(0).seconds(0);
            taskdate = taskdate.hours(0).minutes(0).seconds(0);
            var numdays = Math.round(datevalue.diff(taskdate, 'days', true ));
  //  alert ("numdays "+numdays+" k "+k);//Add numdays to the current date to get the choosen date.
    this.weekDay.push({
      numdays:numdays,
      day: k
    });

  }
  }
  //Calling the postpone api
  postPone(days) {

    var dueDate = new Date(this.selectItem.task_due_date.replace(/-/g, "/"));
    var endDate = new Date(this.selectItem.task_end_date.replace(/-/g, "/"));
  // let today = new Date();
    var dueDateCopy = new Date(this.selectItem.task_due_date.replace(/-/g, "/"));
    dueDateCopy.setDate(dueDateCopy.getDate() + days.numdays);
    var selectedDueDate = this.amOrpmFormat(dueDate, dueDateCopy);
    var selectedEndDueDate = this.amOrpmFormat(endDate, dueDateCopy);

    let formData = new FormData();
    formData.append("id_task", this.selectItem.id_task);
    formData.append("due_date", selectedDueDate);
    formData.append("end_date", selectedEndDueDate);
    this.showloader = true;
    this.authService
      .getPostWithAccessToken(
      "",
      formData,
      this.con.taskDetailEndpoint + this.con.taskstatusPostponeEndpoint
      )
      .then(
        result => {
          this.con.alertMessage(this.con.taskPostponedSuccessMsg);
          this.refreshList = true;
          this.removeBodyBlurClass();
          this.showloader = false;
        },
        err => {
          this.showloader = false;
        }
      );
  }
  //Converting the time formate into AM or PM  //Converting the time formate into AM or PM
  amOrpmFormat(dueDate, selectDate) {
    var hours = dueDate.getHours();
    var minutes = dueDate.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var min = minutes < 10 ? "0" + minutes : minutes;

    var strTime =
      this.con.monthArray[selectDate.getMonth()] +
      " " +
      selectDate.getDate() +
      ", " +
      selectDate.getFullYear() +
      " " +
      hours +
      ":" +
      min +
      ampm;
    return strTime;
  }

  // To close the Popup
  goBack() {
    this.removeBodyBlurClass();
  }

  //Remove the blur class  from body after closing the modal
  removeBodyBlurClass() {
    this.viewCtrl.dismiss(this.refreshList);
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("blur_pop_up");
  }
//this method trigger while view leaving
  ionViewWillLeave() {
    this.removeBodyBlurClass();
  }
}
