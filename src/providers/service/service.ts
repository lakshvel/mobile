/**
 * 
 * service.ts allows you to access its' defined properties and methods. It also helps keep your coding organized.
 * set the data in one place get the data use get method
 * 
 */



import { Injectable } from "@angular/core";

@Injectable()
export class ServiceProvider {
  companyData: any;
  contact:any;
  contactData:any;
  contactCompany:any;
  limitData :any;
  infoData:any;
  companyEmptyForContact:any;
  stakeholderList:any;
  dealPipeStage:any;
  dealData:any;

  //check network status
  isConnected:boolean = true;

  getLimitData() {
    return this.limitData;
  }

  setLimitData(data) {
    this.limitData = data;
  }

  setContactLimitData(contactdata) {
    this.contact = contactdata;
  }

  getContactLimitData() {
    return this.contact;
  }

  setCompanyDetail(companydata) {
    this.companyData = companydata;
  }
  setContactDetail(companydata) {
    this.contactData = companydata;
  }
  getCompanyDetail(){
    return this.companyData;
  }
  getContactDetail() {
    return this.contactData;
  }
  setContactCompanyDetail(contactCompany){
     this.contactCompany=contactCompany;
  }
  getContactCompanyDetail() {
    return this.contactCompany;
  }
  setDealData(dealData){
    this.dealData=dealData;
  }
  getDealData(){
    return this.dealData;
  }
  ionScrollforTab(event) {
    const body = document.getElementsByTagName("body")[0];
    if (event.scrollTop > 50) {
      body.classList.add("info_img_scroll");
    } else {
      body.classList.remove("info_img_scroll");
    }
  }
  setInfoData(info){
    this.infoData=info;
  }
  getInfoData(){
    //console.log('serv',this.infoData)
    return this.infoData;
  }
  //////If contact dont have company then this service will use
  setErrorForContactCompanyEmpty(errorCompanyData){
    //console.log(errorCompanyData)
    this.companyEmptyForContact=errorCompanyData;
  }
  getErrorForContactCompanyEmpty(){
    return this.companyEmptyForContact;
  }
  //Set deals stack holder list service
  setStakeholderList(stakeholderList){
    this.stakeholderList=stakeholderList;
  }
  getStakeholderList(){
    return this.stakeholderList;
  }

  getDealPipelineStage() {
    return this.dealPipeStage;
  }

  setDealPipelineStage(data) {
    this.dealPipeStage = data;
  }

}
