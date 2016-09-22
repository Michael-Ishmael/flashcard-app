import {Directive, ElementRef, Output, EventEmitter, Input, SimpleChange, OnChanges} from '@angular/core';
import {ImageDimensions, CroppedImage} from "../crop";

@Directive({
  selector: '.cropped-image'
})
export class InitCroppedImage implements OnChanges{

  @Output() onImageLoad = new EventEmitter<ImageDimensions>();
  @Input() model:CroppedImage;
  jEl:any;

  constructor(
      private el: ElementRef
  ) { }

  public ngOnInit() {

    if(!this.jEl)
      this.setupJImage();

  }

  private setupJImage(){
    this.jEl = $(this.el.nativeElement);
    var that = this;
    this.jEl.load(function() {
      that.imageLoad();
    });
  }

  private imageLoad(){

    var width = this.jEl.width();
    var height = this.jEl.height();
    var dims = new ImageDimensions(width, height);
    this.onImageLoad.emit(dims);
    var style = this.getImagePreviewStyle(dims);
    this.jEl.attr('style', style);
  }

  ngOnChanges(changes:{[propName:string]:SimpleChange}) {
    if(changes.hasOwnProperty("model")){
      if(!this.jEl)
        this.setupJImage();
      var model:CroppedImage = changes["model"].currentValue;
      this.jEl.attr('style', null);
      this.jEl.attr('src', model.image);
    }
   }

  getImagePreviewStyle(dims):any{
    if(!(this.model && this.model.crop && dims)) return null;
    var crop = this.model.crop;
    var factoredDims = dims.factorSize(this.model.maxWidth);
    var adj = crop.multiply(factoredDims.width, factoredDims.height);
    var css =  `margin-left:-${adj.x}px;margin-top:-${adj.y}px;width:${factoredDims.width}px;height:${factoredDims.height}px`;
    return css;
  }

}
