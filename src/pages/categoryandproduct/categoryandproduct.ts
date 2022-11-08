import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { Upilotconstants } from "../upilotconstant";

@Component({
  selector: 'page-categoryandproduct',
  templateUrl: 'categoryandproduct.html',
})
export class CategoryandproductPage {

  // show Category
  showCategory: boolean = true;
  //show Product
  showProduct: boolean = false;
  dealCategoryEndPoint: any;
  dealProductEndPoint: any;
  dealEndPoint: any;
  showloader: boolean = true; //TO show loader
  categoryList: any;
  productList: any;
  selectedCategory: any;
  productSelected: boolean = false;
  proAndCat:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public authService: AuthServiceProvider,
    public con: Upilotconstants) {
    this.dealCategoryEndPoint = this.con.dealCategoryEndPoint;
    this.dealProductEndPoint = this.con.dealProductEndPoint;
    this.dealEndPoint = this.con.dealDetailEndpoint;
    //get the preefilled data
    this.proAndCat = navParams.get("proAndCat");
  }

 // Runs when the page is about to leave and no longer be the active page.
  ionViewWillEnter() {
    this.authService.getData("", this.dealCategoryEndPoint).then(
      result => {
        //get category List
        this.categoryList = result.data;
        this.showloader = false;
      },
      err => {
        this.showloader = false;
      }
    );
  }

  //Close the modal
  closeModal() {
    this.viewCtrl.dismiss();
  }

  //get product list
  openProduct(category:any) {
    this.showCategory = false;
    this.showProduct = true;
    this.selectedCategory = category;
    this.showloader = true;
    var url = this.dealEndPoint + this.selectedCategory.id_product_category + this.dealProductEndPoint;
    this.authService.getData("", url).then(
      result => {
        this.productList = result.data;
        var idProductCategory = this.proAndCat.category.id_product_category;
        var selectedCat = this.selectedCategory.id_product_category;
        for(let value of this.productList ){
        if (idProductCategory == selectedCat) {
          value.isSelect = this.proAndCat.product.some(function(element) {
            return element.id_product == value.id_product;
          });
        } else {
          value.isSelect = false;
        }
          if (value.isSelect) {
            this.productSelected = true;
          }
        }

        this.showloader = false;
      },
      err => {
        this.showloader = false;
      }
    );
  }

  //assign product and Category
  assignCat() {
    let data = {
      category: '',
      product: []
    };
    data.category = this.selectedCategory;
    if (this.productSelected) {
      this.productList.forEach(element => {
        if (element.isSelect) {
          data.product.push(element);
        }
      });
    }
    this.viewCtrl.dismiss(data);
  }

  //select the product
  productClicked(product: any) {
    this.productSelected = this.productList.some(function (element) {
       return element.isSelect == true
    });
  }

  //the the select product popup
  closeProduct() {
    this.showProduct = false;
    this.selectedCategory = '';
    this.showCategory = true;
  }
}
