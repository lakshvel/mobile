import { ViewController } from 'ionic-angular'
import { Component, ViewChild } from '@angular/core'
import {
  NavController,
  Platform,
  NavParams,
  AlertController,
} from 'ionic-angular'
import { Keyboard } from '@ionic-native/keyboard'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service'
import { ServiceProvider } from '../../providers/service/service'
import { Upilotconstants } from '../upilotconstant'

//declare var dataLayer: Array<any>;

@Component({
  selector: 'page-addnote',
  templateUrl: 'addnote.html',
})
export class AddnotePage {
  @ViewChild('noteInput') noteInput

  updatePageContent: any
  limitData: any
  from: any
  noteId: any
  toggleSet: boolean = false
  showloader: boolean = false //TO show loader

  shpwPrivateLabel: boolean = false
  showSharedLabel: boolean = false

  sharedToast: any
  privateToast: any
  focusout: boolean = false
  addNote = {
    toggleSet: 'false',
    noteDes: '',
  }
  constructor(
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public authService: AuthServiceProvider,
    private keyboard: Keyboard,
    private service: ServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public con: Upilotconstants,
    public platform: Platform
  ) {
    this.limitData = this.service.getLimitData()
    if (navParams.get('keyboardopen') != 'Yes') {
      setTimeout(() => {
        this.noteInput.setFocus()
      }, 600)
    } else {
      if (
        this.limitData.hasOwnProperty('id_type_party') &&
        this.limitData.id_type_party == 1
      ) {
        if (this.limitData.last_name != null) {
          this.addNote.noteDes =
            'Call with ' +
            this.limitData.first_name +
            ' ' +
            this.limitData.last_name
        } else {
          this.addNote.noteDes = 'Call with ' + this.limitData.first_name
        }
      } else if (navParams.get('dealCallDetails') != undefined) {
        this.addNote.noteDes = navParams.get('dealCallDetails')
      }
    }
    //   this.keyboard.show();
    //Addin blur class to body
    const body = document.getElementsByTagName('body')[0]
    if (this.con.isAndroidPlatform) {
      body.classList.add('add_note_tog_andriod')
    }
    body.classList.add('blur_pop_up')

    this.from = navParams.get('from')
    if (this.from == 'task') {
      this.addNote.noteDes = navParams.get('note')
      this.addNote.toggleSet = navParams.get('typecreate')
    }
    this.noteId = navParams.get('Id')
    this.updatePageContent = this.navParams.get('update')
  }

  //while leaving the page this method will trigger
  ionViewWillLeave() {
    this.goBack()

    //this.keyboard.close();
    //  this.keyboard.disableScroll(false);
    this.focusout = true
  }

  //trigger this method when toggle is changed
  doSomething(event) {
    if (event) {
      this.shpwPrivateLabel = true
      this.showSharedLabel = false
      //hide the private label after 5000 miliseconds
      setTimeout(() => {
        this.shpwPrivateLabel = false
      }, 5000)
    } else {
      this.showSharedLabel = true
      this.shpwPrivateLabel = false
      //hide the shared label after 3000 miliseconds
      setTimeout(() => {
        this.showSharedLabel = false
      }, 3000)
    }
  }

  //save note method
  saveNote() {
    if (this.addNote.noteDes.trim() == '') {
      this.presentAlert(this.con.emptyNoteValidation, 'validateNote')
    } else {
      if (this.from == 'agenda') {
        this.saveNoteMethod(
          this.con.taskDetailEndpoint,
          this.noteId,
          this.con.addNoteEndpoint,
          this.from
        )
      } else if (this.from == 'deals') {
        this.saveNoteMethod(
          'deal/',
          this.limitData.id_deal,
          this.con.addNoteEndpoint,
          this.from
        )
      } else if (this.from == 'task') {
        this.updatePageContent(this.addNote)
        this.goBack()
        // this.updatePageContent(this.addNote)
      } else {
        this.saveNoteMethod(
          this.con.infoEndpoint,
          this.limitData.id_party,
          this.con.addNoteEndpoint,
          this.from
        )
      }
    }
  }
  dismiss
  //pushing data to serve.
  saveNoteMethod(firstEndPoint, Id, SecondEndPoint, from) {
    this.showloader = true
    let formData = new FormData()
    formData.append('note', this.addNote.noteDes)
    formData.append('private', this.addNote.toggleSet)
    this.authService
      .getPostWithAccessToken('', formData, firstEndPoint + Id + SecondEndPoint)
      .then(
        (result) => {
          this.showloader = false
          if (result.hasOwnProperty('status') && result.status == 'success') {
            this.updatePageContent()
            this.goBack()
            this.presentAlert(result.message, 'saveNote')
          }
        },
        (err) => {
          this.showloader = false
        }
      )
  }

  //Display alert with  title in the Alert
  presentAlert(msg, action) {
    const body = document.getElementsByTagName('body')[0]
    body.classList.add('alert_change')
    let alert = this.alertCtrl.create({
      subTitle: msg,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            if (action == 'saveNote') {
              body.classList.remove('alert_change')
            }
          },
        },
      ],
    })
    alert.present()
  }

  // To close the Popup
  goBack() {
    const body = document.getElementsByTagName('body')[0]
    body.classList.remove('blur_pop_up')
    this.viewCtrl.dismiss()
  }
  //Preventing keyboard close
  focusOutFunction() {
    if (this.con.isAndroidPlatform) {
      if (!this.focusout) {
        this.noteInput.setFocus()
      }
    }
  }
}
