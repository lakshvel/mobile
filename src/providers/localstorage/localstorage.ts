/**
 * SQLite data source for managing your data in Android and iOS.
 * inserting token detail
 * inserting contact/company/deal/task data
 * inserting user login status
 * inserting user information
 */
import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { Upilotconstants } from "../../pages/upilotconstant";
import { Platform } from "ionic-angular";


@Injectable()
export class LocalstorageProvider {
  DB: any;
  constructor(
    private con: Upilotconstants,
    private storage: Storage,
    private sqlite: SQLite,
    platform: Platform,
  ) {
    platform.ready().then(() => {
      //initlize the sqlite db instance
      this.DB = this.sqlite.create({
        name: "upilot",
        location: "default"
      });
    });
  }

  createAllTable() {
    this.DB.then((db: SQLiteObject) => {
      db.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
        this.con.tempTable +
        "(rowid INTEGER PRIMARY KEY AUTOINCREMENT,apiendpoint text NOT NULL,datavalue text,maintable text,inserteddate datetime)",
        <any>{})
        .then(() => console.log("Executed SQL"))
        .catch(e => console.log(e));
      db
        .executeSql(
        "CREATE TABLE IF NOT EXISTS " +
        this.con.contactsTable +
        "(rowid INTEGER PRIMARY KEY AUTOINCREMENT,apiendpoint text NOT NULL,datavalue text)",
        <any>{}
        )
        .then(() => console.log("Executed SQL"))
        .catch(e => console.log(e));
      db
        .executeSql(
        "CREATE TABLE IF NOT EXISTS " +
        this.con.dealsTable +
        "(rowid INTEGER PRIMARY KEY AUTOINCREMENT,apiendpoint text NOT NULL,datavalue text)",
        <any>{}
        )
        .then(() => console.log("Executed SQL"))
        .catch(e => console.log(e));
      db
        .executeSql(
        "CREATE TABLE IF NOT EXISTS " +
        this.con.loginstatus +
        "(rowid INTEGER PRIMARY KEY AUTOINCREMENT,email text NOT NULL,subdomain text,loginstatus text NOT NULL)",
        <any>{}
        )
        .then(() => console.log("Executed SQL"))
        .catch(e => console.log(e));
      db
        .executeSql(
        "CREATE TABLE IF NOT EXISTS " +
        this.con.tokenanduser +
        "(rowid INTEGER PRIMARY KEY AUTOINCREMENT,data text NOT NULL,endpoint text NOT NULL)",
        <any>{}
        )
        .then(() => console.log("Executed SQL"))
        .catch(e => console.log(e));
      db
        .executeSql(
        "CREATE TABLE IF NOT EXISTS " +
        this.con.dealsPipelineListTable +
        "(rowid INTEGER PRIMARY KEY AUTOINCREMENT,apiendpoint text NOT NULL,datavalue text)",
        <any>{}
        )
        .then(() => console.log("Executed SQL"))
        .catch(e => console.log(e));

      db
        .executeSql(
        "CREATE TABLE IF NOT EXISTS " +
        this.con.contactfilterdata +
        "(rowid INTEGER PRIMARY KEY AUTOINCREMENT,apiendpoint text NOT NULL,datavalue text)",
        <any>{}
        )
        .then(() => console.log("Executed SQL"))
        .catch(e => console.log(e));

      db
        .executeSql(
        "CREATE TABLE IF NOT EXISTS " +
        this.con.contactdetails +
        "(rowid INTEGER PRIMARY KEY AUTOINCREMENT,apiendpoint text NOT NULL,datavalue text)",
        <any>{}
        )
        .then(() => console.log("Executed SQL"))
        .catch(e => console.log(e));

      db
        .executeSql(
        "CREATE TABLE IF NOT EXISTS " +
        this.con.agendaListTable +
        "(rowid INTEGER PRIMARY KEY AUTOINCREMENT,apiendpoint text NOT NULL,datavalue text)",
        <any>{}
        )
        .then(() => console.log("Executed SQL"))
        .catch(e => console.log(e));

      db
        .executeSql(
        "CREATE TABLE IF NOT EXISTS " +
        this.con.agendaDeatilTable +
        "(rowid INTEGER PRIMARY KEY AUTOINCREMENT,apiendpoint text NOT NULL,datavalue text)",
        <any>{}
        )
        .then(() => console.log("Executed SQL"))
        .catch(e => console.log(e));

      db
        .executeSql(
        "CREATE TABLE IF NOT EXISTS " +
        this.con.dealsDetailsTable +
        "(rowid INTEGER PRIMARY KEY AUTOINCREMENT,apiendpoint text NOT NULL,datavalue text)",
        <any>{}
        )
        .then(() => console.log("Executed SQL"))
        .catch(e => console.log(e));

    }).catch(e => console.log(e));
  }

  //Insert the token detail in sqlite db
  insertIntoTokenTable(data, endpoint) {
    var jsonString = JSON.stringify(data);
    this.DB.then((db: SQLiteObject) => {
      db.executeSql(
        "DELETE from " + this.con.tokenanduser + " where endpoint=? ",
        [endpoint]
      );
      db
        .executeSql(
        "INSERT INTO " + this.con.tokenanduser + " VALUES(NULL,?,?)",
        [jsonString, endpoint]
        )
        .then(res => {
          console.log("Suuecssful inseting ", res);
        })
        .catch(e => {
          console.log("Error while inserting", e);
        });
    }).catch(e => console.log(e));
  }

  //insert the logined in user detail in sqlite db
  insertLoginedinUserData(email, subdomain) {
    this.DB.then((db: SQLiteObject) => {
      db.executeSql("DELETE from " + this.con.loginstatus + " ", []);
      db
        .executeSql(
        "INSERT INTO " + this.con.loginstatus + " VALUES(NULL,?,?,?)",
        [email, subdomain, 1]
        )
        .then(res => {
          console.log("Suuecssful inseting ", res);
        })
        .catch(e => {
          console.log("Error while inserting", e);
        });
    }).catch(e => console.log(e));
  }

  //get the token detail from the sqlite db
  getDataFromTokenTable(endpoint) {
    return new Promise<any>((resolve, reject) => {
      this.DB.then((db: SQLiteObject) => {
        db
          .executeSql(
          "SELECT * FROM " + this.con.tokenanduser + " where endpoint=? ",
          [endpoint]
          )
          .then(res => {
            if (res.rows.length > 0) {
              resolve(JSON.parse(res.rows.item(0).data));
            }
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      }).catch(e => {
        console.log(e);
        //only for browser
        this.storage.get("token").then(val => {
          resolve(val);
        });
      });
    });
  }
  //get the email and subdomain to check user has logined in last time
  //if same user logined in again the the preserve the local storage data
  //if different user is logined in then clear the local storage and store new data 
  getEmailAndSubdomain(email, subdomain) {
    return new Promise<any>((resolve, reject) => {
      this.DB.then((db: SQLiteObject) => {
        db
          .executeSql(
          "SELECT * FROM " +
          this.con.loginstatus +
          " WHERE email=? and subdomain=?",
          [email, subdomain]
          )
          .then(res => {
            if (res.rows.length > 0) {
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch(e => {
            reject(e);
          });
      }).catch(e => {
        console.log(e);
        resolve(false);
      });
    });
  }

  //check login status 
  checkLoginStatus() {
    return new Promise<any>((resolve, reject) => {
      this.DB.then((db: SQLiteObject) => {
        db
          .executeSql("SELECT * FROM " + this.con.loginstatus + "", [])
          .then(res => {
            if (res.rows.length > 0 && res.rows.item(0).loginstatus == 1) {
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch(e => {
            console.log("ERROR ", e);
            resolve(false);
          });
      }).catch(e => {
        console.log(e);
        resolve(true);
      });
    });
  }

  // update the login status to 0 in case of explicitly logout
  logoutfromlocalstorage() {
    this.DB.then((db: SQLiteObject) => {
      db.executeSql("UPDATE " + this.con.loginstatus + " SET loginstatus=? ", [0])
      .then(res => {
        console.log("updated ", res);
      })
      .catch(e => {
        console.log("Error while updating ", e);
      });

    })
  }

  // Insert the data in selected table
  insertSelectedTable(apiendpoint, data, tableName) {
    var jsonString = JSON.stringify(data);
    this.DB.then((db: SQLiteObject) => {
      db
        .executeSql("SELECT * FROM " + tableName + " WHERE apiendpoint=?", [
          apiendpoint
        ])
        .then(res => {
          if (res.rows.length == 0) {
            db
              .executeSql("INSERT INTO " + tableName + " VALUES(NULL,?,?)", [
                apiendpoint,
                jsonString
              ])
              .then(res => {
                console.log("Inserted ", apiendpoint);
              })
              .catch(e => {
                console.log("Error while inserting", apiendpoint);
              });
          } else {
            db
              .executeSql(
              "UPDATE " + tableName + " SET datavalue=? WHERE apiendpoint=?",
              [jsonString, apiendpoint]
              )
              .then(res => {
                console.log("Updated ", res);
              })
              .catch(e => {
                console.log("Error while updating ", e);
              });
          }
        })
        .catch(e => {
          console.log(e);
        });
    }).catch(e => console.log(e));
  }

  // Get the data from selected table
  getDataFromSelectecTable(apiendpoint, tableName) {
    return new Promise<any>((resolve, reject) => {
      this.DB.then((db: SQLiteObject) => {
        db
          .executeSql("SELECT * FROM " + tableName + " WHERE apiendpoint=?", [
            apiendpoint
          ])
          .then(res => {
         //   var jsonobj = { "data": [],"paging":[] };
            if (res.rows.length > 0) {
              resolve(JSON.parse(res.rows.item(0).datavalue));
            } else {
            //  resolve(JSON.parse(JSON.stringify(jsonobj)));
              reject('Error');
            }

          })
          .catch(e => {
            reject(e);
          });
      }).catch(e => console.log(e));
    });
  }

  //delete all the record from local storage
  deleteallAllTableRecord() {
    return new Promise<any>((resolve, reject) => {
      this.DB.then((db: SQLiteObject) => {
        db.executeSql("DELETE from " + this.con.contactfilterdata + " ", []);
        db.executeSql("DELETE from " + this.con.contactsTable + " ", []);
        db.executeSql("DELETE from " + this.con.contactdetails + " ", []);
        db.executeSql("DELETE from " + this.con.dealsTable + " ", []);
        db.executeSql("DELETE from " + this.con.dealsPipelineListTable + " ", []);
        db.executeSql("DELETE from " + this.con.agendaListTable + " ", []);
        db.executeSql("DELETE from " + this.con.agendaDeatilTable + " ", []);
        db.executeSql("DELETE from " + this.con.dealsDetailsTable + " ", []);

      }).catch(e => console.log(e));
    });
  }

  getDataFromStorage(resolve, reject, endpoint, selectId,type) {
    switch (endpoint) {
      //get user information details
      case this.con.meEndpoint:
        this.getDataFromTokenTable(endpoint).then(result => {
          console.log("result ", JSON.stringify(result));
          return resolve(result);
        }, err => {
          return reject(err);
        });
        break;
        //get contact fiter details
      case this.con.contactfiterEndpoint:
        this.getDataFromSelectecTable(endpoint, this.con.contactfilterdata).then(result => {
          console.log("result ", JSON.stringify(result));
          return resolve(result);
        }, err => {
          return reject(err);
        });
        break;
        //get deal list detail
      case this.con.dealslistEndpoint:
        this.getDataFromSelectecTable(endpoint+ selectId, this.con.dealsTable).then(result => {
          console.log("result ", JSON.stringify(result));
          return resolve(result);
        }, err => {
          return reject(err);
        });
        break;
        //get deal filter detail
      case this.con.dealfilterEndpoint:
        this.getDataFromSelectecTable(endpoint, this.con.dealsTable).then(result => {
          console.log("result ", JSON.stringify(result));
          return resolve(result);
        }, err => {
          return reject(err);
        });
        break;
      //get company/contact listing detail
      case this.con.contactsEndpoint:
        this.getDataFromSelectecTable(endpoint + selectId, this.con.contactsTable).then(result => {
          console.log("result ", JSON.stringify(result));
          return resolve(result);
        }, err => {
          return reject(err);
        });
        break;

      //get company/contact info detail
      case this.con.infoEndpoint + selectId:
        this.getDataFromSelectecTable(endpoint, this.con.contactdetails).then(result => {
          return resolve(result);
        }, err => {
          return reject(err);
        });
        break;
      //get company/contact deals detail
      case this.con.infoEndpoint + selectId + this.con.dealsEndpoint:
        this.getDataFromSelectecTable(endpoint, this.con.contactdetails).then(result => {
          return resolve(result);
        }, err => {
          return reject(err);
        });
        break;
      //get company/contact deals company
      case this.con.infoEndpoint + selectId + this.con.companyEndpoint:
        this.getDataFromSelectecTable(endpoint, this.con.contactdetails).then(result => {
          return resolve(result);
        }, err => {
          return reject(err);
        });
        break;
      //get company/contact history company
      case this.con.infoEndpoint + selectId + this.con.historyEndpoint:
      if(type == 'deal'){
        this.getDataFromSelectecTable(endpoint, this.con.dealsDetailsTable).then(result => {
          return resolve(result);
        }, err => {
          return reject(err);
        });
      }else{
        this.getDataFromSelectecTable(endpoint, this.con.contactdetails).then(result => {
          return resolve(result);
        }, err => {
          return reject(err);
        });
      }
        break;
      //Get the deals pipe line list
      case this.con.dealPipelitsEndpoint:
        this.getDataFromSelectecTable(endpoint, this.con.dealsPipelineListTable).then(result => {
          return resolve(result);
        }, err => {
          return reject(err);
        });
        break;

        //Get the Agenda Detail
        case this.con.dealDetailEndpoint + selectId:
        this.getDataFromSelectecTable(endpoint, this.con.dealsDetailsTable).then(result => {
          return resolve(result);
        }, err => {
          return reject(err);
        });
        break;
        //Get the Agenda List
        case this.con.agendaEndpoint:
        this.getDataFromSelectecTable(endpoint+ selectId, this.con.agendaListTable).then(result => {
          return resolve(result);
        }, err => {
          return reject(err);
        });
        break;

        //Get the Agenda filter List
        case this.con.agendaFilterEndpoint:
        this.getDataFromSelectecTable(endpoint, this.con.agendaListTable).then(result => {
          return resolve(result);
        }, err => {
          return reject(err);
        });
        break;

        //Get the Agenda Detail
        case this.con.taskDetailEndpoint + selectId:
        this.getDataFromSelectecTable(endpoint, this.con.agendaDeatilTable).then(result => {
          return resolve(result);
        }, err => {
          return reject(err);
        });
        break;

      default:
        break;
    }
  }
  /**
   * @param {any} data
   * @param {any} endpoint
   * @memberof AuthServiceProvider
   */
  //insert data into sqlite db
  insertDataintoStorage(data, endpoint, selectId,type) {
    switch (endpoint) {
      //insert user information detail
      case this.con.meEndpoint:
        this.insertIntoTokenTable(data, endpoint);
        break;
      //insert company/contact filter detail
      case this.con.contactfiterEndpoint:
        this.insertSelectedTable(endpoint, data, this.con.contactfilterdata);
        break;
      //insert company/contact listing detail
      case this.con.contactsEndpoint:
        this.insertSelectedTable(
          endpoint + selectId,
          data,
          this.con.contactsTable
        );
        break;
      //insert company/contact info detail
      case this.con.infoEndpoint + selectId:
        this.insertSelectedTable(endpoint, data, this.con.contactdetails);
        break;
      //insert company/contact deals detail
      case this.con.infoEndpoint + selectId + this.con.dealsEndpoint:
        this.insertSelectedTable(endpoint, data, this.con.contactdetails);
        break;
      //insert company/contact deals company
      case this.con.infoEndpoint + selectId + this.con.companyEndpoint:
      this.insertSelectedTable(endpoint, data, this.con.contactdetails);
        
        break;
      //insert company/contact/Deal History company
      case this.con.infoEndpoint + selectId + this.con.historyEndpoint:
        if(type == 'deal'){
          console.log("endpoint ",endpoint);
          this.insertSelectedTable(endpoint, data, this.con.dealsDetailsTable);
        } else{
          this.insertSelectedTable(endpoint, data, this.con.contactdetails);
        }
        break;
      //insert deal list
      case this.con.dealfilterEndpoint:
        this.insertSelectedTable(endpoint, data, this.con.dealsTable);
        break;
      //insert deal list
      case this.con.dealslistEndpoint:
        this.insertSelectedTable(endpoint+ selectId, data, this.con.dealsTable);
        break;

        //insert Deal Details
      case this.con.dealDetailEndpoint + selectId:
      this.insertSelectedTable(endpoint, data, this.con.dealsDetailsTable);
      break;

      //insert deal pipe  list
      case this.con.dealPipelitsEndpoint:
        this.insertSelectedTable(endpoint, data, this.con.dealsPipelineListTable);
        break;

        //insert Agenda List
      case this.con.agendaEndpoint:
      this.insertSelectedTable(endpoint+ selectId, data, this.con.agendaListTable);
      break;
      //insert Agenda filter list
      case this.con.agendaFilterEndpoint:
      this.insertSelectedTable(endpoint, data, this.con.agendaListTable);
      break;
      

      //insert Agenda Details
      case this.con.taskDetailEndpoint + selectId:
      this.insertSelectedTable(endpoint, data, this.con.agendaDeatilTable);
      break;

      default:
        break;
    }
  }
  //Run cron job based on the time span to store the offline data
  runCronJobForOfflineData(apiEndpoint, data, mainTableName) {
    var jsonString = JSON.stringify(data);
    this.DB.then((db: SQLiteObject) => {
      db
        .executeSql("SELECT * FROM " + this.con.tempTable + " WHERE apiendpoint=?", [
          apiEndpoint
        ])
        .then(res => {
          if (res.rows.length == 0) {
            db
              .executeSql("INSERT INTO " + this.con.tempTable + " VALUES(NULL,?,?,?,?)", [
                apiEndpoint,
                jsonString,
                mainTableName,
                '30-01-2018'
              ])
              .then(res => {
                this.insertDatainMaintable(apiEndpoint, data, mainTableName);

              })
              .catch(e => {
              });
          } else {
            db
              .executeSql(
              "UPDATE " + this.con.tempTable + " SET datavalue=? WHERE apiendpoint=?",
              [jsonString, apiEndpoint]
              )
              .then(res => {
                this.insertDatainMaintable(apiEndpoint, data, mainTableName);
              })
              .catch(e => {
              });
          }
        })
        .catch(e => {
        });
    }).catch(e => console.log(e, 'errorororo'));
    console.log(apiEndpoint, data, mainTableName, 'coming into the temp data');
  }
  //Insert the data into main table
  insertDatainMaintable(apiEndPoint, data, mainTableName) {
    // this.insertSelectedTable(apiEndPoint, data, mainTableName);
    return new Promise<any>((resolve, reject) => {
      this.DB.then((db: SQLiteObject) => {
        db.executeSql("DELETE from " + mainTableName + " ", []);
        this.insertSelectedTable(apiEndPoint, data, mainTableName);
      }).catch(e => console.log(e));
    });
  }
  truncateTempTable(apiEndPoint, mainTableName) {
    return new Promise<any>((resolve, reject) => {
      this.DB.then((db: SQLiteObject) => {
        db.executeSql("TRUNCATE table" + this.con.tempTable + " ", []);
      }).catch(e => console.log(e));
    });
  }
}
