import {Component, OnInit, Input, Optional, ViewChild, AfterViewInit, SimpleChange, Output, EventEmitter} from '@angular/core';
import {InitializeJcrop} from "../initialize-jcrop.directive";
import {Crop} from "../crop";
import {CropModel, ImageDimensions} from "../crop.component";
import {NgStyle} from "@angular/common";

@Component({
  moduleId: module.id,
  selector: 'img-cropper',
  templateUrl: 'img-cropper.component.html',
  styleUrls: ['img-cropper.component.css'],
  directives: [InitializeJcrop, NgStyle]
})
export class ImgCropperComponent implements OnInit, AfterViewInit {

  @Input() image:string;
  @Input() model:CropModel;
  @Input() showPreview:boolean= false;

  @Output() public onCropSelect = new EventEmitter<Crop>();

  @ViewChild(InitializeJcrop) jCropper:InitializeJcrop;

  private imageDimensions:ImageDimensions;

  constructor(  ) { }

  ngOnInit() {

  }

  ngAfterViewInit(){
    //console.log(this.jCropper.setCrop())
  }

  getImagePreviewContainerStyle():any{
    if(!(this.model && this.model.crop && this.imageDimensions)) return null;
    var adj = this.model.crop.multiply(this.imageDimensions.width, this.imageDimensions.height);
    var obj = {'left': adj.x + 'px', 'top': (adj.y) + 'px', 'width': adj.w + 'px', 'height': adj.h + 'px' };
    return obj;
  }

  getImagePreviewStyle():any{
    if(!(this.model && this.model.crop && this.imageDimensions)) return null;
    var adj = this.model.crop.multiply(this.imageDimensions.width, this.imageDimensions.height);
    var obj = {'margin-left': '-' + adj.x + 'px', 'margin-top': '-' + adj.y + 'px', 'width': this.imageDimensions.width + 'px', 'height': this.imageDimensions.height + 'px' }
    return obj;
  }

  onImageLoaded(imageDims:ImageDimensions){
    this.imageDimensions = imageDims;
  }

  onCropSelected(crop:Crop){
    this.onCropSelect.emit(crop);
    //var adjustedCrop = crop.divide(this.imageWidth, this.imageHeight);
    //this.crop = adjustedCrop;
  }



}
