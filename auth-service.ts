/**
 * auth service.ts 
 * it is used to invoke the the resful api 
 * every http request is invoking from hare
 */


import { Upilotconstants } from "./../../pages/upilotconstant";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Globals } from "../../global";
import { LocalstorageProvider } from "../localstorage/localstorage";
import { Storage } from "@ionic/storage";

@Injectable()
export class AuthServiceProvider {
  constructor(
    private local: LocalstorageProvider,
    private globals: Globals,
    private HttpClient: HttpClient,
    private con: Upilotconstants,
    private storage: Storage
  ) { }
  //Calling api for login and forgot password without access token
  postData(credentials, endpoint) {
    var headers = new HttpHeaders();
    var cluster = '';
    if(this.con.cluster != undefined && this.con.cluster != '' && this.con.cluster != null && this.con.cluster != 'null' ) {
      cluster = '/c/' + this.con.cluster;
    } 
    var subdomain = '';
    if(this.con.subdomain != '' && this.con.subdomain != null) {
      subdomain = this.con.subdomain + '.';
    }
    return new Promise<any>((resolve, reject) => {
      this.HttpClient.post<any>(
        this.globals.baseAPISubDomain + subdomain + this.globals.baseAPIUrl + cluster + this.globals.baseAPIPath + endpoint,
        credentials,
        {
          headers: headers
        }
      ).subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }
  /**
   *
   *
   * @param {any} selectId
   * @param {any} formData
   * @param {any} endpoint
   * @returns
   * @memberof AuthServiceProvider
   */

  //Calling api   with access token by using POSt method
  getPostWithAccessToken(selectId, formData:FormData, endpoint) {

    return new Promise<any>((resolve, reject) => {
      try {
        var historyKey = formData.get("element_type");
      } catch (error) {
        var historyKey:FormDataEntryValue;  
      }
      // Checking Internet is connected Or Not
      if (this.con.isConnected) {
        // Get the Token Detail from the Local storage
        this.local.getDataFromTokenTable(this.con.loginAuthEndpoint)
          .then(val => {
            //assign the access token in http request header
            const headers = new HttpHeaders().set(
              "Authorization",
              val.token_type + " " + val.access_token
            );
            this.con.cluster = val.cluster;
            this.con.subdomain = val.subdomain;
            var cluster = '';
            if(this.con.cluster != undefined && this.con.cluster != '' && this.con.cluster != null && this.con.cluster != 'null' ) {
              cluster = '/c/' + this.con.cluster;
            }
            var subdomain = '';
            if(this.con.subdomain != '' && this.con.subdomain != null) {
              subdomain = this.con.subdomain + '.';
            }
            //Invoking the Post method with api base url, api end point,form data and header
            this.HttpClient.post<any>(
              this.globals.baseAPISubDomain + subdomain + this.globals.baseAPIUrl + cluster + this.globals.baseAPIPath + endpoint,
              formData,
              { headers }
            ).subscribe(
              res => {
                //console.log("getPostWithAccessToken ", res);
              
                /****************** Commented for beta realse **************************/
                //updating the response in local storage
                //this.local.insertDataintoStorage(res, endpoint, selectId,historyKey);
                /****************** Commented for beta realse **************************/
                resolve(res);
              },
              err => {
                //checking access token is expired or not 
                // status is 401 -expired
                if (err.status == 401) {
                  //Invoke refresh token api
                  var formDataRefresh = new FormData();
                  //append the grant type in from data
                  formDataRefresh.append(
                    this.con.grantType,
                    this.globals.refreshTokenGrantType
                  );
                  //append the client Id in from data
                  formDataRefresh.append(
                    this.con.clientId,
                    this.globals.clientId
                  );
                  //append the client Secret in from data
                  formDataRefresh.append(
                    this.con.clientSecret,
                    this.globals.clientSecret
                  );

                  formDataRefresh.append(
                    'cluster',
                    this.con.cluster
                  );

                  //append the refresh_token in from data
                  formDataRefresh.append("refresh_token", val.refresh_token);
                  //invoke the refresh token api to get new access token
                  this.postData(
                    formDataRefresh,
                    this.con.loginAuthEndpoint
                  ).then(
                    result => {
                      //updating the token detail in local storage
                      this.local.insertIntoTokenTable(
                        result,
                        this.con.loginAuthEndpoint
                      );
                      // invoke again the current request 
                      this.getPostWithAccessToken(
                        result.access_token,
                        formData,
                        endpoint
                      ).then(
                        result => {
                          resolve(result);
                        },
                        err => {
                          reject(err);
                        }
                      );
                    },
                    err => {
                      reject(err);
                      // forbidden Error like Server side validation
                      if (err.error.error == this.con.forbiddenError) {
                        this.con.alertMessage(err.error.error_description);
                        //Internal server Error
                      } else if (err.status == '500') {
                        // (10-06-2020 @Laksh) Commented the internal error msg something went wrong
                        //this.con.alertMessage(this.con.internalErrorHandling);
                      }
                       //server side validation error
                      else if (err.error == 'true') {
                        this.con.alertMessage(err.error.message);
                      }
                    }
                  );
                } else {
                  reject(err);
                   // forbidden Error like Server side validation
                  if (err.error.error == this.con.forbiddenError) {
                    this.con.alertMessage(err.error.error_description);
                     //Internal server Error
                  } else if (err.status == '500') {
                    // (10-06-2020 @Laksh) Commented the internal error msg something went wrong
                    // this.con.alertMessage(this.con.internalErrorHandling);
                    //server side validation error
                  } else if (err.error == 'true') {
                    this.con.alertMessage(err.error.message);
                  }
                }
              }
            );
          })
          .catch(err => {
            //console.log(err);
          });
      } else {
        /****************** Commented for beta realse **************************/
        //get the data from local storage
       // this.local.getDataFromStorage(resolve, reject, endpoint, selectId,historyKey);
        /****************** Commented for beta realse **************************/
      }
    });
  }

  /**
   *
   *
   * @param {any} selectId
   * @param {any} endpoint
   * @returns
   * @memberof AuthServiceProvider
   */
  //Calling api   with access token by using GET method
  getData(selectId, endpoint) {
    return new Promise<any>((resolve, reject) => {
      // Get the Token Detail from the Local storage
      this.local.getDataFromTokenTable(this.con.loginAuthEndpoint)
        .then(val => {
          // Checking Internet is connected Or Not
          if (this.con.isConnected) {
            //assign the access token in http request header
            const headers = new HttpHeaders().set(
              "Authorization",
              val.token_type + " " + val.access_token
            );
            this.con.cluster = val.cluster;
            this.con.subdomain = val.subdomain;
            var cluster = '';
            if(this.con.cluster != undefined && this.con.cluster != '' && this.con.cluster != null && this.con.cluster != 'null' ) {
              cluster = '/c/' + this.con.cluster;
            }
            var subdomain = '';
            if(this.con.subdomain != '' && this.con.subdomain != null) {
              subdomain = this.con.subdomain + '.';
            }
            //Invoking the Post method with api base url, api end point and header
            this.HttpClient.get<any>(this.globals.baseAPISubDomain + subdomain + this.globals.baseAPIUrl + cluster + this.globals.baseAPIPath + endpoint, {
              headers: headers
            }).subscribe(
              res => {
                //console.log("getData ", res);
                /****************** Commented for beta realse **************************/
              //   this.local.insertDataintoStorage(res, endpoint, selectId,'');
                resolve(res);
                /****************** Commented for beta realse **************************/
              },
              err => {
                //checking access token is expired or not 
                // status is 401 -expired
                if (err.status == 401) {
                  //Invoke refresh token api
                  var formData = new FormData();
                  //append the grant type in from data
                  formData.append(
                    this.con.grantType,
                    this.globals.refreshTokenGrantType
                  );
                  //append the client ID
                  formData.append(this.con.clientId, this.globals.clientId);
                  //append the client secret
                  formData.append(
                    this.con.clientSecret,
                    this.globals.clientSecret
                  );

                  formData.append(
                    'cluster',
                    this.con.cluster
                  );

                  //append the refresh_token
                  formData.append("refresh_token", val.refresh_token);
                  //invoke the refresh token api to get new access token
                  this.postData(formData, this.con.loginAuthEndpoint).then(
                    result => {
                      //updating the token detail in local storage
                      this.local.insertIntoTokenTable(
                        result,
                        this.con.loginAuthEndpoint
                      );
                      // invoke again the current request 
                      this.getData(result.access_token, endpoint).then(
                        result => {
                          resolve(result);
                        },
                        err => {
                          reject(err);
                        }
                      );
                    },
                    err => {
                      reject(err);
                    }
                  );
                } else {
                  reject(err);
                }
              }
            );
          } else {
            /****************** Commented for beta realse **************************/
            //get the data from local storage
          //  this.local.getDataFromStorage(resolve, reject, endpoint, selectId,'');
            /****************** Commented for beta realse **************************/
          }
        })
        .catch(err => {
          //console.log(err);
        });
    });
  }
  /**
   *
   *
   * @param {any} selectId
   * @param {any} formData
   * @param {any} endpoint
   * @returns
   * @memberof AuthServiceProvider
   */
//Invoke api based on scroll the page to get next set of data set
  getDataBasedonScroll(URL, formData) {
    return new Promise<any>((resolve, reject) => {
       // Checking Internet is connected Or Not
      if (this.con.isConnected) {
         // Get the Token Detail from the Local storage
        this.local
          .getDataFromTokenTable(this.con.loginAuthEndpoint)
          .then(val => {
            //set the access token in http request header
            const headers = new HttpHeaders().set(
              "Authorization",
              val.token_type + " " + val.access_token
            );
            //console.log(val, 'tokens from sezzion2')
            this.HttpClient.post<any>(URL, formData, { headers }).subscribe(
              res => {
                resolve(res);
              },
              err => {
                reject(err);
              }
            );
          });
      }
    });
  }
}
