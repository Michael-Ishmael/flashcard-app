import {Directive, ElementRef, Output, EventEmitter} from '@angular/core';
import {ImageDimensions} from "../crop";

@Directive({
  selector: '.cropped-image'
})
export class InitCroppedImage {

  @Output() onImageLoad = new EventEmitter<ImageDimensions>();
  jEl:any;

  constructor(
      private el: ElementRef
  ) { }

  public ngOnInit() {

    if(!this.jEl){
      this.jEl = $(this.el.nativeElement);
      var that = this;
      this.jEl.load(function() {
        that.imageLoad();
      });
    }

  }

  private imageLoad(){

    var width = this.jEl.width();
    var height = this.jEl.height();
    var dims = new ImageDimensions(width, height);
    this.onImageLoad.emit(dims);
  }

}
