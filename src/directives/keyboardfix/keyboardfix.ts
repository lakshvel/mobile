/**
 * keyboardfix.ts is used to show & hide the footer when keyboard us show or hide
 * if  keyboard is open, hide the footer
 * keyboard is going to close,show the footer
 * 
 * 
 */

import { Directive, OnDestroy, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { Subscription } from 'rxjs/Subscription';
import { Upilotconstants } from '../../pages/upilotconstant';

@Directive({
  selector: '[hidefooter]'
})
export class KeyboardfixDirective implements OnInit, OnDestroy {
  private onShowSubscription: Subscription;

  constructor(
    private keyboard: Keyboard,
    private con: Upilotconstants
  ) { }

  ngOnInit() {
    if (!this.con.isIPadPlatform) {
      this.onShowSubscription = this.keyboard.onKeyboardShow()
        .subscribe(e => this.onShowKeyboard(e));
      this.onShowSubscription = this.keyboard.onKeyboardHide()
        .subscribe(e => this.onHideKeyboard(e));
    }

  }

  ngOnDestroy() {
    if (this.onShowSubscription) {
      this.onShowSubscription.unsubscribe();
    }
  }

  private onShowKeyboard(e) {
    this.con.hideFooter = true;
  }
  private onHideKeyboard(e) {
    this.con.hideFooter = false;
  }
}