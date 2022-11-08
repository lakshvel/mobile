import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { CompanytabPage } from '../companytab/companytab';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { Upilotconstants } from "../upilotconstant";
import { ServiceProvider } from "../../providers/service/service";
import { EditcompanyinfoPage } from '../editcompanyinfo/editcompanyinfo';

@Component({
  selector: 'page-companycreated',
  templateUrl: 'companycreated.html',
})
export class CompanycreatedPage {
  companyData: any;//To store the company data from API 
  showloader: boolean = true;//To show lader
  countries: any;//to save the country list

  showCompanyAddress: boolean = false;

  @ViewChild('nameInputToFocus') nameInputToFocus;
  @ViewChild('addressInputToFocus') addressInputToFocus;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public authService: AuthServiceProvider,
    public con: Upilotconstants,
    public service: ServiceProvider) {
    this.countriesList();
  }
//When view loaded this method will triggers
  ionViewDidLoad() {
    this.companyData = this.navParams.get('contactOrCompanyDetails');
    if (this.companyData.address != '') {
      this.showCompanyAddress = true;
    }

    this.openCompany();
  }
  //TO close the modal
  close_modal() {
    this.viewCtrl.dismiss();
  }
  //To open company
  openCompany() {
    this.companyData.id_party=this.companyData.company_id;
    this.service.setLimitData(this.companyData);
    this.navCtrl.push(CompanytabPage,{openTab:'info', isCreated: true});
    this.viewCtrl.dismiss();
  }
  //Get the list of countries
  countriesList() {
    this.showloader = true;
    this.authService.getData('', this.con.countryListEndpoint).then(
      result => {
        this.showloader = false;
        this.countries = result;
        this.con.updateListPageContent();
      },
      err => {
        this.showloader = false;
      }
    );
  }
}
