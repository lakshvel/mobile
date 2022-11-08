import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";


@Component({
  selector: "page-wait",
  templateUrl: "wait.html"
})
export class WaitPage {
  status: boolean = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  ionViewDidLoad() {
    //console.log("ionViewDidLoad WaitPage");
    // this.navCtrl.setRoot(SidemenuPage);
    //  this.filterList();
  }
}
