import {Directive, OnInit, EventEmitter, Output, ElementRef, Input} from '@angular/core';
import {ImageDimensions} from "../../crop/crop.component";

declare var $: any;

@Directive({
  selector: '.init-preview-img'
})
export class InitPreviewImg implements OnInit {

  @Input() id:number;
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
    dims.id = this.id;
    this.onImageLoad.emit(dims);
  }


}
