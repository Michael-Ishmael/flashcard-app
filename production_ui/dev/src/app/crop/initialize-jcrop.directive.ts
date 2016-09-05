import {Directive, OnInit, ElementRef, Output, EventEmitter, SimpleChange, OnChanges, Input} from '@angular/core';
import {Crop} from "./crop";

declare var $: any;

@Directive({
  selector: '.jCropper'
})
export class InitializeJcrop implements OnInit, OnChanges {

  @Input() crop:Crop;
  @Output() public onSelect = new EventEmitter<Crop>();

  private jCropApi:any;

  constructor(private el: ElementRef) {
  }

  public ngOnInit() {
    var jEl = $(this.el.nativeElement);
    this.jCropApi = $.Jcrop(this.el.nativeElement);
    var that = this;
    this.jCropApi.setOptions({
      onSelect : function(crop:any) {
          that.onCropSelected(crop);
        }
    });
    if(this.crop){
      this.jCropApi.setSelect(this.crop.toCoordArray())
    }
    jEl.load(function() {
      console.log('img load');
    });
  }

  public ngOnDestroy() {
    $(this.el.nativeElement).Jcrop('destroy');
  }

  public onCropSelected(c:Crop){
    this.onSelect.emit(c);
  }

  public ngOnChanges(changes:{[propName:string]:SimpleChange}) {
    if(changes.hasOwnProperty("crop") && this.jCropApi){
      var cropCoords = changes["crop"].currentValue.toCoordArray();
      this.jCropApi.setSelect(cropCoords);
    }
  }



}
