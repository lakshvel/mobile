import { Component, Input, ElementRef, Renderer } from "@angular/core";

@Component({
  selector: "expandable",
  templateUrl: "expandable.html"
})
export class ExpandableComponent {
  @Input("scrollArea") scrollArea: any;

  newHeaderHeight: any;
  headerHeight: number = 80;

  constructor(public element: ElementRef, public renderer: Renderer) { }

  ngOnInit() {
    this.scrollArea.ionScroll.subscribe(ev => {
      this.resizeHeader(ev);
    });
  }

  resizeHeader(ev) {
    ev.domWrite(() => {

      this.newHeaderHeight = this.headerHeight - ev.scrollTop;

      if (this.newHeaderHeight < 12) {
        this.newHeaderHeight = 12;
      }

      var index = 0;
      for (let headerElement of this.element.nativeElement.children) {
        if (index == 1) {
          this.renderer.setElementStyle(headerElement, "padding-top", this.newHeaderHeight + "px");
        }
        index++;
      }
    });
  }
}
