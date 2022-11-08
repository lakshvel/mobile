/**
 * Auto suggest  for all the place
 * 
 */


import { Upilotconstants } from "./../../pages/upilotconstant";
import { AutoCompleteService } from "ionic2-auto-complete";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { AuthServiceProvider } from "../auth-service/auth-service";

@Injectable()
export class ComautosuggestProvider implements AutoCompleteService {
  //display auto suggest company data based on below json key
  labelAttribute :string;
  //labelAttribute = "stkhlr_name";

  constructor(
    private authService: AuthServiceProvider,
    public con: Upilotconstants
  ) {}
  //filter the value based on the user keyword
  getResults(keyword: string) {
    this.labelAttribute = this.con.autoCompleteLabel;
    var formdata = new FormData();
    formdata.append("keyword", keyword);
    return this.authService.getPostWithAccessToken("", formdata, this.con.searchComEndpoint)
      .then(
        result => {
          //console.log(result);
          if (result == null) {
            return [];
          } else {
            return result;
          }
        },
        err => {
          //console.log(err.error);
        }
      );
  }
}
