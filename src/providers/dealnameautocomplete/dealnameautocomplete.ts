/**
 * Auto suggest  for log task &
 * because there are two auto suggest field
 * so for that this auto suggest field is created
 * 
 */

import { Upilotconstants } from "./../../pages/upilotconstant";
import { AutoCompleteService } from "ionic2-auto-complete";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { AuthServiceProvider } from "../auth-service/auth-service";


@Injectable()
export class DealnameautocompleteProvider implements AutoCompleteService {
  //display auto suggest company data based on below json key
  labelAttribute ='deal_name';
  //labelAttribute = "stkhlr_name";

  constructor(
    private authService: AuthServiceProvider,
    public con: Upilotconstants
  ) {}
  //filter the value based on the user keyword
  getResults(keyword: string) {
    var formdata = new FormData();
    formdata.append("keyword", keyword);
    //console.log('DealnameautocompleteProvider');
    return this.authService.getPostWithAccessToken("", formdata, this.con.addTaskDealAutoCompleteEndpoint)
      .then(
        result => {
          if (result == null) {
            return [];
          } else {
            // if(this.labelAttribute=='deal_name'){
              //console.log(result.data)
            //   return result;
            // }else{
            
            // }
            return result.data;
          }
        },
        err => {
          //console.log(err.error);
        }
      );
  }

}
