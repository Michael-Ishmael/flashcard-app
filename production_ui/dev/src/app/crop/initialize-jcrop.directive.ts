import {
  Directive, OnInit, ElementRef, Output, EventEmitter, SimpleChange, OnChanges, Input
} from '@angular/core';
import {Crop, AspectRatio} from "./crop";
import {CropModel, ImageDimensions} from "./crop.component";

declare var $: any;

@Directive({
  selector: '.jCropper'
})
export class InitializeJcrop implements OnInit, OnChanges {

  @Input() image:string;
  @Input() model:CropModel;

  @Output() public onSelect = new EventEmitter<Crop>();
  @Output() public onImageLoad = new EventEmitter<ImageDimensions>();

  private jCropApi:any;
  private width:number;
  private height:number;

  private mask:any;

  constructor(
    private el: ElementRef
  ) {   }

  public ngOnInit() {
    var jEl = $(this.el.nativeElement);
    var that = this;
    jEl.load(function() {
      that.width = jEl.width();
      that.height = jEl.height();
      that.onImageLoad.emit(new ImageDimensions(that.width, that.height));

      that.jCropApi = $.Jcrop(that.el.nativeElement);
      var aspectRatio = that.model ? that.model.aspectRatioFraction : 1;

      that.jCropApi.setOptions({
        allowResize: true,
        aspectRatio: aspectRatio,
        onSelect : function(crop:any) {
          that.onCropSelected(crop);
        }
      });
      if(that.model){
        that.setCropOnJCrop(that.model.crop);
      }
    });
  }

  public ngOnDestroy() {
    $(this.el.nativeElement).Jcrop('destroy');
  }

  public onCropSelected(c:Crop){
    var crop = new Crop(c.x, c.y, c.w, c.h);
    var adjusted = crop.divide(this.width, this.height);
    this.onSelect.emit(adjusted);
  }

  public ngOnChanges(changes:{[propName:string]:SimpleChange}) {
    if(this.jCropApi){
      if(changes.hasOwnProperty("model")){
        var model:CropModel = changes["model"].currentValue;
        this.jCropApi.setOptions({ aspectRatio: model.aspectRatioFraction});
        this.setCropOnJCrop(model.crop);
        this.setMask(model.cropFoil);
      }
    }
  }

  private setCropOnJCrop(crop:Crop):void{
    var adjusted = crop.multiply(this.width, this.height);
    var cropCoords = adjusted.toCoordArray();
    this.jCropApi.setSelect(cropCoords);
  }

  private setMask(maskCrop:Crop):void{
    if(!maskCrop && this.mask){
      this.mask.hide();
      return;
    }
    var adj = maskCrop.multiply(this.width, this.height);
    if(!this.mask)
      this.mask = $('<div class="crop-mask"></div>');
    this.mask.remove();
    this.mask.attr('style', null);
    this.mask.css('left', adj.x);
    this.mask.css('top', adj.y);
    this.mask.css('width', adj.w);
    this.mask.css('height', adj.h);
    $('.jcrop-holder').append(this.mask);
    this.mask.show();
  }

}