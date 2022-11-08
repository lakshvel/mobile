import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { ServiceProvider } from './../../providers/service/service';
import { AddnotePage } from '../addnote/addnote';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'page-dealcall',
  templateUrl: 'dealcall.html',
})
export class DealcallPage {
  dealPartyAccordin: boolean = false;
  dealStakeholdersAccordin = [];
  dealCallDetails: any;
  updatePageContent:any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,public callNumber:CallNumber,
    private service: ServiceProvider,
    public modalCtrl: ModalController) {
    this.updatePageContent = navParams.get('update');
  }

  //this method will stop the html unstill data renders 
  ionViewCanEnter() {
    this.dealCallDetails = this.service.getInfoData();
    // console.log(this.dealCallDetails);
    for (var i = 0; i < this.dealCallDetails.stakeholders.length; i++) {
      this.dealStakeholdersAccordin.push(false);
    }
    if (this.dealCallDetails.party) {
      this.dealPartyAccordin = true;
    } else if (this.dealStakeholdersAccordin.length) {
      this.dealStakeholdersAccordin[0] = true;
    }
  }

  //To dismiss the modal
  goBack() {
    this.viewCtrl.dismiss();
  }
  //To get the accordin
  toggleSectionCall(from, event) {
    if (from == 'party') {
      if (this.dealPartyAccordin) {
        this.dealPartyAccordin = false;
      } else {
        this.dealPartyAccordin = true;
      }
    } else {
      if (this.dealStakeholdersAccordin[from]) {
        this.dealStakeholdersAccordin[from] = false;
      } else {
        this.dealStakeholdersAccordin[from] = true;
      }
    }
  }
  //To check accordin open or close
  hasClass(ele, cls) {
    return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
  }

    //to open add note page
    openNote(data,status,ph) {
      this.callNumber.callNumber(ph, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
      const body = document.getElementsByTagName('body')[0];
      body.classList.add('blur_pop_up');
      var noteDes ='';
      if(status =='contact'){
      if(data.last_name != null){
        noteDes = 'Call with '+data.first_name + ' '+data.last_name;
      } else{
        noteDes = 'Call with '+data.first_name ;
      }
    } else if(status =='stakeholder'){
      noteDes = 'Call with '+ data.full_name
    }
  
      const profileModal = this.modalCtrl.create(AddnotePage, {dealCallDetails:noteDes,from:'deals',keyboardopen:'Yes', update: this.updatePageContent }, { cssClass: "modal_exapn_tab" });
      profileModal.present();
    }

}