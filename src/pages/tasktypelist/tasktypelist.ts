import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service'
import { Upilotconstants } from '../upilotconstant';
import { CreatetaskPage } from '../createtask/createtask';

@Component({
  selector: 'page-tasktypelist',
  templateUrl: 'tasktypelist.html',
})
export class TasktypelistPage {

  taskList: any;//taskList constant
  showLoader: boolean = true;//Loader hide and show variable
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCntl: ViewController,
    public authService: AuthServiceProvider,
    public constant: Upilotconstants,
    public modalCtrl: ModalController) {
    this.taskTypeList();
    
  }

  //Dismiss the modal
  goBack() {
    this.viewCntl.dismiss();
  }
  //Get the list of task type list
  taskTypeList() {
    this.authService.getData('', this.constant.taskTypeListEndoint).then(
      result => {
        this.showLoader = false;
        this.taskList = result.data;
      }, err => {
      }
    )
  }
  //to create a task
  createTask(task) {
    const profileModal = this.modalCtrl.create(CreatetaskPage, { task: task,tabPage:this.navParams.get('tabPage') }, { cssClass: "modal_exapn_tab" }
    );
    profileModal.present();
  }
}
