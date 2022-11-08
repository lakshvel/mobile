// globals.ts
import { Injectable } from "@angular/core";

@Injectable()
export class Globals {
  //Pre Production Base URL (UnComment below line to point for Pre Production)
  //readonly baseAPIUrl: string = "https://preprodcrm.upilot.com/crmapp/api-mobile-v3/V3/";
  
  //Dev Environment - Base URL (UnComment below line to point for Dev Environment)
  //  readonly baseAPISubDomain: string = "https://";
  //  readonly baseAPIUrl: string = "preprodcrm.upilot.com";
  //  readonly baseAPIPath: string = "/crmapp/api-mobile-v3/V3/";
   
 //readonly baseAPIUrl: string = "https://testandroid.devcrm.upilot.com/crmapp/api-mobile-v3/V3/";
 // readonly baseAPIUrl: string = "https://devcrm.upilot.com/c/f8545/branches/qa01/crmapp/api-mobile-v3/V3/";
 //readonly baseAPIUrl: string = "https://devcrm.upilot.com/branches/qa03/crmapp/api-mobile-v3/V3/";
 //Testing release 3
 // readonly baseAPIUrl: string = "https://testandroid.devcrm.upilot.com/c/f8545/branches/qa01/crmapp/api-mobile-v3/V3/";
 
  //Live Environment - Base URL (UnComment below line to point for Live Environment)
  readonly baseAPISubDomain: string = "https://";
  readonly baseAPIUrl: string = "upilot.com";
  readonly baseAPIPath: string = "/crmapp/api-mobile-v3/V3/";
  // grant Type
  readonly grantType: string = "password";

  //Client Id  for Auth 2.0
  readonly clientId: string = "ios";

  //clientSecret  for Auth 2.0
  readonly clientSecret: string = "testsecret";


  //used for refreshing the token
  readonly refreshTokenGrantType: string = "refresh_token";
  
  startBackgroundProcess:boolean;

}
