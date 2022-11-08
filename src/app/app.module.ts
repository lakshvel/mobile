import { DirectivesModule } from './../directives/directives.module';
import { ComponentsModule } from './../components/components.module';
import { ChangecontactstatusPage } from './../pages/changecontactstatus/changecontactstatus';
import { WaitPage } from './../pages/wait/wait';
import { AddnewcontactorcompanyPage } from './../pages/addnewcontactorcompany/addnewcontactorcompany';
import { Keyboard } from '@ionic-native/keyboard';
import { AddnotePage } from './../pages/addnote/addnote';
import { EditcontactinfoPage } from './../pages/editcontactinfo/editcontactinfo';
import { EditcompanyinfoPage } from './../pages/editcompanyinfo/editcompanyinfo';
import { CompanytabPage } from './../pages/companytab/companytab';
import { SidemenuPage } from './../pages/sidemenu/sidemenu';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from '@angular/http';
import { SQLite } from "@ionic-native/sqlite";
import { Network } from '@ionic-native/network';
import { ClickOutsideModule } from 'ng-click-outside';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { IonicStorageModule } from '@ionic/storage';
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ForgotpasswordPage } from '../pages/forgotpassword/forgotpassword';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { ChooseaccountPage } from '../pages/chooseaccount/chooseaccount';
import { ContactlistPage } from '../pages/contactlist/contactlist';
import { Globals } from '../global';
import { ServiceProvider } from '../providers/service/service';
import { ContacttabsPage } from '../pages/contacttabs/contacttabs';
import { ContactorcontactlinkPage } from '../pages/contactorcontactlink/contactorcontactlink';
import { ContactorcompanycallPage } from '../pages/contactorcompanycall/contactorcompanycall';
import { ContactplusPage } from '../pages/contactplus/contactplus';
import { ContactcreatedPage } from '../pages/contactcreated/contactcreated';
import { LocalstorageProvider } from '../providers/localstorage/localstorage';
import { ContactexistsPage } from '../pages/contactexists/contactexists';
import { CompanycreatedPage } from '../pages/companycreated/companycreated';
import { ContactordealcreatelinkPage } from '../pages/contactordealcreatelink/contactordealcreatelink';
import { DealtabsPage } from '../pages/dealtabs/dealtabs';
import { AddnewdealPage } from '../pages/addnewdeal/addnewdeal';
import { CategoryandproductPage } from '../pages/categoryandproduct/categoryandproduct';
import { AddstakeholderPage } from '../pages/addstakeholder/addstakeholder';
import { ChangedealstatusPage } from '../pages/changedealstatus/changedealstatus';
import { DealcallPage } from '../pages/dealcall/dealcall';
import { EditdealvaluePage } from '../pages/editdealvalue/editdealvalue';
import { LazyImgComponent } from '../global/components/';
import { LazyLoadDirective } from '../global/directives/';
import { ImgcacheService } from '../global/services/';
import { Upilotconstants } from '../pages/upilotconstant';
import { ComautosuggestProvider } from '../providers/comautosuggest/comautosuggest';
import { LoginbackgroundprocessProvider } from '../providers/loginbackgroundprocess/loginbackgroundprocess';
import { AgendalistPage } from '../pages/agendalist/agendalist';
import { DealwonorlostPage } from '../pages/dealwonorlost/dealwonorlost';
import { PostponePage } from '../pages/postpone/postpone';
import { DatePickerModule } from 'ion-datepicker';
import { DatePipe } from '@angular/common';
import { MomentModule } from 'angular2-moment';
import { TasktypelistPage } from '../pages/tasktypelist/tasktypelist';
import { Intercom } from '@ionic-native/intercom';
import { CreatetaskPage } from '../pages/createtask/createtask';
import { TaskeditPage } from '../pages/taskedit/taskedit';
import { DealnameautocompleteProvider } from '../providers/dealnameautocomplete/dealnameautocomplete';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations"
import { ResponsibleautocompleteProvider } from '../providers/responsibleautocomplete/responsibleautocomplete';
import { CallNumber } from '@ionic-native/call-number';
import { DeallistPage } from '../pages/deallist/deallist';
import { Device } from '@ionic-native/device/ngx';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ForgotpasswordPage,
    ChooseaccountPage,
    ContactlistPage,
    SidemenuPage,
    CompanytabPage,
    ContacttabsPage,
    EditcompanyinfoPage,
    EditcontactinfoPage,
    AddnotePage,
    AddnewcontactorcompanyPage,
    ContactorcontactlinkPage,
    ContactorcompanycallPage,
    ContactplusPage,
    ContactcreatedPage,
    CompanycreatedPage,
    LazyImgComponent,
    LazyLoadDirective,
    WaitPage,
    ContactexistsPage,
    ContactordealcreatelinkPage,
    DealtabsPage,
    AddnewdealPage,
    CategoryandproductPage,
    AddstakeholderPage,
    ChangedealstatusPage,
    DealcallPage,
    EditdealvaluePage,
    DealwonorlostPage,
    AgendalistPage,
    PostponePage,
    TasktypelistPage,
    ChangecontactstatusPage,
    CreatetaskPage,
    TaskeditPage,
    DeallistPage
  ],
  imports: [
    PopoverModule.forRoot(),
    BrowserModule,
    MomentModule,
    ClickOutsideModule,
    HttpClientModule,
    AutoCompleteModule,
    HttpModule,
    DatePickerModule,
    BrowserAnimationsModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      platforms: {
        ios: {
          statusbarPadding: true
        }
      }
    }),
    ComponentsModule,
    DirectivesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ForgotpasswordPage,
    ChooseaccountPage,
    ContactlistPage,
    SidemenuPage,
    CompanytabPage,
    ContacttabsPage,
    EditcompanyinfoPage,
    EditcontactinfoPage,
    AddnotePage,
    AddnewcontactorcompanyPage,
    ContactorcontactlinkPage,
    ContactorcompanycallPage,
    ContactplusPage,
    ContactcreatedPage,
    LazyImgComponent,
    CompanycreatedPage,
    WaitPage,
    ContactexistsPage,
    ContactordealcreatelinkPage,
    DealtabsPage,
    AddnewdealPage,
    CategoryandproductPage,
    AddstakeholderPage,
    ChangedealstatusPage,
    DealcallPage,
    EditdealvaluePage,
    DealwonorlostPage,
    AgendalistPage,
    PostponePage,
    TasktypelistPage,
    ChangecontactstatusPage,
    CreatetaskPage,
    TaskeditPage,
    DeallistPage
  ],
  providers: [
    Keyboard,
    StatusBar,
    SplashScreen,
    Device,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthServiceProvider,
    Globals,
    CallNumber,
    ServiceProvider,
    LocalstorageProvider,
    SQLite,
    Network,
    ImgcacheService,
    Upilotconstants,
    ComautosuggestProvider,
    LoginbackgroundprocessProvider,
    DatePipe,
    Intercom,
    DealnameautocompleteProvider,
    ResponsibleautocompleteProvider
  ]
})
export class AppModule { }
