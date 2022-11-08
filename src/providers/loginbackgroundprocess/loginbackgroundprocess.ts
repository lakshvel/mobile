/**
 * loginbackgroundprocess.ts is used to store the data for offline purpose
 * it store data in sqlite database
 * 
 */

import { Injectable } from "@angular/core";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { Upilotconstants } from "../../pages/upilotconstant";

@Injectable()
export class LoginbackgroundprocessProvider {
  constructor(
    public con: Upilotconstants,
    public authService: AuthServiceProvider,
  ) {}
  // Get the contact list from api
  getContactListFormApi(filter_val) {
    return new Promise<any>((resolve, reject) => {
      let formData = new FormData();
      formData.append("filterViewId", filter_val);
      formData.append("limit", this.con.recordlimit);
      this.authService
        .getPostWithAccessToken(filter_val, formData, this.con.contactsEndpoint)
        .then(
          result => {
            if (result.data.length == 0) {
              resolve();
            } else {
              for (var i = 0; i < result.data.length; i++) {
                this.getInfoFromApi(
                  result.data[i].id_party,
                  resolve,
                  i,
                  result.data.length
                );
              }
            }
          },
          err => {
          }
        );
    });
  }
  //To get the dropdown values from api
  filterList() {
    this.authService.getData("token", this.con.contactfiterEndpoint).then(
      result => {
        this.iterateDropdown(result.data).then(res => {});
      },
      err => {
      }
    );
  }

  iterateDropdown(result) {
    var i = 0;
    return new Promise<any>((resolve, reject) => {
      for (let data of result) {
        if (data.isDefault == 1) {
          this.getContactListFormApi(data.filterViewId).then(results => {
            resolve();
          });
        }
      }
    });
  }

  //Get the contact info from api
  getInfoFromApi(contactId, resolve, current, size) {
    this.authService.getData(contactId, this.con.infoEndpoint + contactId).then(
      result => {
        this.getHistoryFromApi(contactId, resolve, current, size);
      },
      err => {
        this.getHistoryFromApi(contactId, resolve, current, size);
      }
    );
  }
  ///Get the company details from api
  getCompanyDealFromApi(contactId, resolve, current, size) {
    this.authService
      .getData(
        contactId,
        this.con.infoEndpoint + contactId + this.con.dealsEndpoint
      )
      .then(
        result => {
          this.getCompanyContactFromApi(contactId, resolve, current, size);
        },
        err => {
          this.getCompanyContactFromApi(contactId, resolve, current, size);
        }
      );
  }

  // Get the company related contacts from api
  getCompanyContactFromApi(contactId, resolve, current, size) {
    this.authService
      .getData(
        contactId,
        this.con.infoEndpoint + contactId + this.con.companyEndpoint
      )
      .then(
        result => {
          if (current + 1 == size) {
            return resolve();
          }
        },
        err => {
          if (current + 1 == size) {
            return resolve();
          }
        }
      );
  }

  ///Get the contact deals details from api
  getHistoryFromApi(contactId, resolve, current, size) {
    let formData = new FormData();
    formData.append("element_type", "party");
    formData.append("limit", "10");
    this.authService
      .getPostWithAccessToken(
        contactId,
        formData,
        "contact/" + contactId + "/history"
      )
      .then(
        result => {
          this.getCompanyDealFromApi(contactId, resolve, current, size);
        },
        err => {
          this.getCompanyDealFromApi(contactId, resolve, current, size);
        }
      );
  }
  //Get  the offline data for dels filter
  getDealsFilterlist() {
    this.authService.getData("token", this.con.dealfilterEndpoint).then(
      result => {
        this.iterateDealsDropdown(result).then(res => {
        });
      },
      err => {
      }
    );
  }
  iterateDealsDropdown(result) {
    var i = 0;
    return new Promise<any>((resolve, reject) => {
      for (let data of result.data) {
        if (data.isDefault == 1) {
          this.getDealsListFormApi(data.filterViewId).then(results => {
            i++;
            if (i == result.data.length) {
              resolve();
            }
          });
        }
      }
    });
  }

  getDealsListFormApi(filter_val) {
    return new Promise<any>((resolve, reject) => {
      let formData = new FormData();
      formData.append("filterViewId", filter_val);
      formData.append("limit", this.con.recordlimit);
      this.authService
        .getPostWithAccessToken(
          filter_val,
          formData,
          this.con.dealslistEndpoint
        )
        .then(
          result => {

            if (result.data.length == 0) {
              resolve();
            } else {
              for (var i = 0; i < result.data.length; i++) {
                this.getDealFromApi(
                  result.data[i].id_deal,
                  resolve,
                  i,
                  result.data.length
                );
              }
            }

          },
          err => {
          }
        );
    });
  }

  ///Get the deal details from api
  getDealFromApi(dealId, resolve, current, size) {
    this.authService
      .getData(dealId, this.con.dealDetailEndpoint + dealId)
      .then(result => {
        this.getHistoryFromApiForDeal(dealId, resolve, current, size);
        if (result.hasOwnProperty("party") && result.party.hasOwnProperty("company_id") &&
        result.party.company_id !=null) {
          this.getDealCompanyFromApi(result.party.company_id);
        }

      }, err => {
        this.getHistoryFromApiForDeal(dealId, resolve, current, size);
      });
  }

  ///Get the dealId history deals details from api
  getHistoryFromApiForDeal(dealId, resolve, current, size) {
    let formData = new FormData();
    formData.append("element_type", "deal");
    formData.append("limit", "10");
    this.authService
      .getPostWithAccessToken(
        dealId,
        formData,
        "contact/" + dealId + "/history"
      )
      .then(
        result => {
          if (current + 1 == size) {
            return resolve();
          }
        },
        err => {
          if (current + 1 == size) {
            return resolve();
          }
        }
      );
  }

  ///Get the company details from api
  getDealCompanyFromApi(contactId) {
    this.authService
      .getData(
        contactId,
        this.con.infoEndpoint + contactId + this.con.dealsEndpoint
      )
      .then(
        result => {
        },
        err => {
        }
      );
  }

  getDealsPipelist() {

    this.authService.getData("", this.con.dealPipelitsEndpoint).then(
      result => {
        this.getDealsFilterlist();
      },
      err => {
        this.getDealsFilterlist();
      }
    );
  }

  //get agenda filter list
  agendaFilterList(){
    this.authService.getData('',this.con.agendaFilterEndpoint).then(
      result=>{
          for(let opt of result.data){
            if(opt.isDefault==1){
              this.getAgendaListFormApi(opt.filterViewId);
             // this.optionsValue=opt.filterViewId;
              //this.con.agendaCachedFilter=this.optionsValue
              //break;
            }
          }
      
      },err=>{

      }
    )
   
  }

  // Get the agenda list from api
  getAgendaListFormApi(filterValue) {
    let formData=new FormData();
    formData.append('filterViewId',filterValue);
    this.authService. getPostWithAccessToken(filterValue, formData, this.con.agendaEndpoint).then(
      result => {
        for (let data of result.data) {
          this.getTaskDetailFormApi(data.id_task);
        }
      },
      err => {
      }
    );
  }

  // Get the task detail list from api
  getTaskDetailFormApi(agendaId) {
    this.authService
      .getData(agendaId, this.con.taskDetailEndpoint + agendaId)
      .then(result => {}, err => {});
  }
  getNotificationsCount(){
    this.authService.getData('',this.con.notificationsCountEndpoint).then(
      result=>{
        // //console.log(result);
        this.con.notificationsCount=result.data.count;
        this.con.notificationsCountDeal=result.data.deal;
        this.con.notificationsCountOther=result.data.other;
        this.getNotifications();
      },err=>{      
      }
    );
  }
  getNotifications(){
    this.authService.getData('',this.con.notificationsEndpoint).then(
      result=>{
        this.con.notificationsResult=result;
      },err=>{      
      }
    );
  }
}
