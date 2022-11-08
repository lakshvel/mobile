import { Component, ViewChild } from "@angular/core";
import {
  NavController,
  NavParams,
  ViewController,
  AlertController
} from "ionic-angular";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { Upilotconstants } from "../upilotconstant";
import { DatePipe } from '@angular/common';

@Component({
  selector: "page-editdealvalue",
  templateUrl: "editdealvalue.html"
})
export class EditdealvaluePage {
  @ViewChild("durationInputToFocus") durationInputToFocus;
  @ViewChild("valueInputToFocus") valueInputToFocus;
  @ViewChild("dateTimePicker") dateTimePicker;
  @ViewChild("quantityInputToFocus") quantityInputToFocus;
  totalDealValue: number = 0;
  // product_qty:number = 1;
  myForm: FormGroup;
  formArr: FormArray;
  isTask: boolean;
  amountOfValues = 1;
  dealCurrencyEndPoint: any;
  currencySymbol: any;
  durationText = [];
  showValueField = [];
  showProductQtyValue = [];
  formSubmitFlag: boolean = false;
  dealValue: any;
  disableSubmit: boolean = false;
  from: any;
  initDate: any;
  date:any;
  mobnumPattern:any;
  //Setting the deal value frequency
  frequencyList = this.con.dealFrequencyValue;
  showloader: boolean; //TO show loader
  updatePageContent:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private formbuilder: FormBuilder,
    public authService: AuthServiceProvider,
    public con: Upilotconstants,
    public alertCtrl: AlertController,
    public datePipe: DatePipe
  ) {
    // //console.log('Hii');
    // this.product_qty = 1;
    if (navParams.get('istask') !== undefined) {
      
      this.isTask = true;
      this.from = navParams.get('from');
      this.initDate = navParams.get('initDate');
      this.date=this.datePipe.transform(this.initDate,'MMM. dd ,yyyy hh:mm a');
     
      this.updatePageContent=navParams.get('update');
    } else {
      this.isTask = false;
    }
    this.myForm = formbuilder.group({
      dealValues: formbuilder.array([])
    });
    this.dealValue = navParams.get("dealValue");
    
    this.formArr = this.myForm.controls.dealValues as FormArray;
    this.dealCurrencyEndPoint = this.con.dealCurrencyEndPoint;
    //To auto fill the deal value once deal data enters
    // //console.log("dealValue 1", this.dealValue);
    if (this.dealValue !== undefined) {
      if (this.dealValue.value.length > 0) {

        //console.log(this.dealValue.value.length);
        //console.log(this.dealValue.value);

        var i = 0;
        for (let data of this.dealValue.value) {
          
          this.buildFormForpreFilledData(
            data.value,
            data.frequency,
            data.duration,
            data.id_deal_value,
            data.product_qty
          );
          if (i == 0) {
            this.showValueField.push({ status: true, value: "" });
            // this.showProductQtyValue.push({value: 1 });

          } else {
            this.showValueField.push({ status: true, value: data.value });
            // this.showProductQtyValue.push({value: data.product_qty });
          }
          var curInd = i++;
          this.onSelectChange(data, curInd);
          //console.log("data value", data);
          this.quantityChange(data, curInd);
        }
        //console.log("this.showValueField", this.showValueField);
        //console.log("this.showProductQtyValue", this.showProductQtyValue);
      } else {
        this.addAnotherPayment();
      }
    }
  }
  //calling the deal currency value when deal enter into this page
  ionViewWillEnter() {
    if (this.dealValue !== undefined) {
    this.authService.getData("", this.dealCurrencyEndPoint).then(
      result => {
        this.currencySymbol = result.data.currency_symbol;
        this.showloader = false;
        setTimeout(() => {
          this.valueInputToFocus.setFocus();
        }, 1000);
      },
      err => {
        this.showloader = false;
      }
    );
  }else{
    setTimeout(() => {
      document.body.classList.remove("hide_div_datetime");
      //to open date and time picker for create task and edit task
      document.getElementById('datetimePicker').click()
    }, 500);
  }
}

  //Close the modal
  closeModal() {
    this.viewCtrl.dismiss();
  }

  //Alert for error validations
  showAlert(msg) {
    let alert = this.alertCtrl.create({
      subTitle: msg,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: "OK"
        }
      ]
    });
    alert.present();
  }

  //setting the deal value
  setValue() {
    this.formSubmitFlag = true;
    
    if (this.myForm.valid) {
      let totalValue = this.currencySymbol + " " + this.totalDealValue;
      let responseData = {
        valueArray: this.formArr.value,
        totalValue: totalValue
      };
      this.viewCtrl.dismiss(responseData);
    } else {
      var msg = "value is Required";
      this.showAlert(msg);
      return false;
    }
  }

  //to bild the form  pre fill data
  buildFormForpreFilledData(dealvalue, frequency, duration, id_value, product_qty) {
    
    this.formArr.push(
      this.formbuilder.group({
        value: [dealvalue, Validators.required],
        frequency: [frequency],
        duration: [duration],
        id_deal_value: [id_value],
        product_qty: [product_qty, [Validators.required, Validators.pattern("^([1-9][0-9]+|[1-9])$")]]
      })
    );

    if (frequency != "one") {
      this.durationText.push(true);
    } else {
      this.durationText.push(false);
    }
  }
  //add another payment
  addAnotherPayment() {
    this.formArr.push(
      this.formbuilder.group({
        value: ["", Validators.required],
        frequency: ["one"],
        duration: [""],
        id_deal_value: [""],
        product_qty: ["1", [Validators.required, Validators.pattern("^([1-9][0-9]+|[1-9])$")]]
      })
    );
    this.durationText.push(false);
    this.showValueField.push({ status: true, value: "" });
    // this.showProductQtyValue.push({value: 1 });
    this.disableSubmit = false;
  }

  //on select of deal frequency pre fill the duration value
  onSelectChange(dealValue: any, index: any) {
    //console.log(this.formArr,'formarr', dealValue, index)
    switch (dealValue.frequency) {
      case "one":
        {
          this.durationText[index] = false;
          this.formArr.controls[index].patchValue({ duration: "" });
        }
        break;
      case "hourly":
        {
          this.durationText[index] = "hours";
          if (!dealValue.duration) {
            this.formArr.controls[index].patchValue({ duration: 1 });
          }
        }
        break;
      case "daily":
        {
          this.durationText[index] = "days";
          if (!dealValue.duration) {
            this.formArr.controls[index].patchValue({ duration: 1 });
          }
        }
        break;
      case "weekly":
        {
          this.durationText[index] = "weeks";
          if (!dealValue.duration) {
            this.formArr.controls[index].patchValue({ duration: 1 });
          }
        }
        break;
      case "monthly":
        {
          this.durationText[index] = "months";
          if (!dealValue.duration) {
            this.formArr.controls[index].patchValue({ duration: 1 });
          }
        }
        break;
      case "annually":
        {
          this.durationText[index] = "years";
          if (!dealValue.duration) {
            this.formArr.controls[index].patchValue({ duration: 1 });
          }
        }
        break;
    }
    this.updateTotalDealValue(dealValue, index);
  }
  //change the deal duration on focus out
  durationChange(dealValue: any, index: any) {
    if (!dealValue.duration) {
      this.formArr.controls[index].patchValue({ duration: 1 });
    }
    this.updateTotalDealValue(dealValue, index);
  }
  //Calculating the deal values while entering
  valueChange(dealValue: any, index: any) {
    this.showValueField[index] = { status: false, value: dealValue.value };
    this.updateTotalDealValue(dealValue, index);
  }

   //change the deal quantity on focus out edited by evol tech
  quantityChange(dealValue: any, index: any) {
    if (!dealValue.product_qty) {
      this.formArr.controls[index].patchValue({ product_qty: dealValue.product_qty });
    }
    this.updateTotalDealValue(dealValue, index);
  }


  //Converting the deal value to amount
  convertDealValue(amount) {
    if (amount > 0) {
      return amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    } else {
      return 0;
    }
  }
  //Calculating the deal values focus in
  valueChangeFocusIn(index) {
    this.showValueField[index] = { status: true, value: "" };
    setTimeout(() => {
      this.valueInputToFocus.setFocus();
    }, 400);
  }

  //Updating the deal value at top of the header
  updateTotalDealValue(dealValue: any, index: any) {
    var total = 0;
    for (var i = 0; i < this.formArr.controls.length; i++) {
      let currentDealValue = this.formArr.controls[i].value;
      // //console.log('currentDealValuestart');
      // //console.log(currentDealValue);
      // //console.log('currentDealValueend');
      if (currentDealValue.frequency == "one" && currentDealValue.value) {
        total += parseInt(currentDealValue.value) *
                 parseInt(currentDealValue.product_qty);
      } else if (currentDealValue.value) {
        total +=
          parseInt(currentDealValue.value) *
          parseInt(currentDealValue.duration) *
          parseInt(currentDealValue.product_qty);
      }
    }
    this.totalDealValue = total;
    // }
  }

  //delete the form add payment
  removeSelectedFromDealValue(dealValue) {
    //  var index = array.indexOf(5);
    for (var i = 0; i < this.formArr.controls.length; i++) {
      if (dealValue == this.formArr.controls[i]) {
        this.formArr.controls.splice(i, 1);
        var index = this.formArr.value.indexOf(dealValue.value);
        this.formArr.value.splice(index, 1);
        this.durationText.splice(i, 1);
        this.showValueField.splice(i, 1);
        // this.showProductQtyValue.splice(i, 1);
        this.updateTotalDealValue("", i);
      }
    }
    if (this.formArr.controls.length == 0) {
      this.disableSubmit = true;
    }
  }

  get formData() {
     ////console.log(this.myForm.get("dealValues"), 'myform data');
    return <FormArray>this.myForm.get("dealValues");
  }
///To close the modal after selecting the date
  setMoment(date){
    this.updatePageContent(this.initDate,'datetime');
    this.viewCtrl.dismiss();    
  }
  ionViewWillLeave(){
    document.body.classList.add("hide_div_datetime");
  }
}
