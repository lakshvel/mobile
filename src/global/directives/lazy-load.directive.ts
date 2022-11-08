import { Directive,
         ElementRef,
         EventEmitter,
         Input,
         Output,
         OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Platform } from 'ionic-angular/platform/platform';

import { ImgcacheService } from '../services/';


/**
 * This directive is charge of cache the images and emit a loaded event
 */
@Directive({
  selector: '[lazy-load]'
})
export class LazyLoadDirective implements OnInit, OnDestroy {

  @Input('inputSrc') src ='';
  @Output() loaded = new EventEmitter();

  public loadEvent: any;
  public errorEvent: any;

  constructor(public el: ElementRef,
              public imgCacheService: ImgcacheService,
              public renderer: Renderer2, private platform: Platform) {}

  ngOnInit() {
    // get img element
    const nativeElement = this.el.nativeElement;
    const render = this.renderer;

    // add load listener
    this.loadEvent = render.listen(nativeElement, 'load', () => {
      render.addClass(nativeElement, 'loaded');
      this.loaded.emit();
    });

    this.errorEvent = render.listen(nativeElement, 'error', () => {
      nativeElement.remove();
    });

    var _windowVar = this.platform.win();
        
    var _platform  = _windowVar['device']['platform'];
    var _devVersion = _windowVar['device']['version'];

    //To store the images locally
    if(_platform != 'Android' && _devVersion != '11') {

      // cache img and set the src to the img
      this.imgCacheService.cacheImg(this.src).then((value) => {
        render.setAttribute(nativeElement, 'src', value);
      });
    } else {
      render.setAttribute(nativeElement, 'src', this.src);
    }
  }

  ngOnDestroy() {
    // remove listeners
    this.loadEvent();
    this.errorEvent();
  }

}
