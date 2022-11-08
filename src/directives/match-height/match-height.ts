import {
  Directive,
  ElementRef,
  Input
} from "@angular/core";
import { Upilotconstants } from "../../pages/upilotconstant";
@Directive({
  selector: "[myMatchHeight]" // Attribute selector
})
export class MatchHeightDirective {
  // class name to match height
  @Input() myMatchHeight: string;

  totalElement: number = 0;

  constructor(private con: Upilotconstants, private el: ElementRef) {

  }

  ngAfterViewChecked() {
    // call our matchHeight function here later
    this.matchHeight(this.el.nativeElement, this.myMatchHeight);
  }

  matchHeight(parent: HTMLElement, className: string) {
    // match height logic here

    if (!parent) return;

    // step 1: find all the child elements with the selected class name
    const children = parent.getElementsByClassName(className);

    if (!children) return;

    if (this.totalElement == children.length) return;

    this.totalElement = children.length;

    // step 2a: get all the child elements heights
    const itemHeights = Array.from(children).map((x: HTMLElement) => {
      var paraHeight;
      var indexing = 0;
      Array.from(x.children).map((y: HTMLElement) => {
        const height = y.getBoundingClientRect().height;
        if (indexing == 0) {
          paraHeight = height;
          if (paraHeight > this.con.maxPHeightToHide) {
            y.style.height = this.con.maxPHeightToHide + `px`;
            y.style.overflow = `hidden`;
          }
        } else if (indexing == 1) {
          if (paraHeight <= this.con.maxPHeightToHide) {
            y.style.display = `none`;
          }
        } else if (indexing == 2) {
          y.style.display = `none`;
         
        }
        indexing++;
      });
    });

  }
}
