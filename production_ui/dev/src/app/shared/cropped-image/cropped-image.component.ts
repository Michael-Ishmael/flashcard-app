import {Component, OnInit, Input} from '@angular/core';
import {ImageDimensions, CroppedImage} from "../crop";
import {InitCroppedImage} from "./init-cropped-image.directive";

@Component({
  moduleId: module.id,
  selector: 'cropped-image',
  templateUrl: 'cropped-image.component.html',
  styleUrls: ['cropped-image.component.css'],
  directives: [InitCroppedImage]
})
export class CroppedImageComponent implements OnInit {

  @Input() model:CroppedImage;

  private imageDimensions:ImageDimensions;

  constructor() { }

  ngOnInit() {
  }

  onImageLoaded(dims:ImageDimensions){
    this.imageDimensions = dims;
  }

  getImagePreviewContainerStyle():any{
    if(!(this.model && this.model.crop && this.imageDimensions)) return null;
    var crop = this.model.crop;
    var factoredDims = this.imageDimensions.factorSize(this.model.maxWidth);
    var adj = crop.multiply(factoredDims.width, factoredDims.height);
    var obj = {'left': adj.x + 'px', 'top': (adj.y) + 'px', 'width': adj.w + 'px', 'height': adj.h + 'px' };
    return obj;
  }

  getImagePreviewStyle():any{
    if(!(this.model && this.model.crop && this.imageDimensions)) return null;
    var crop = this.model.crop;
    var factoredDims = this.imageDimensions.factorSize(this.model.maxWidth);
    var adj = crop.multiply(factoredDims.width, factoredDims.height);
    var obj = { 'margin-left': '-' + adj.x + 'px', 'margin-top': '-' + adj.y + 'px', 'width':  + factoredDims.width + 'px', 'height': + factoredDims.height + 'px' }
    return obj;
  }



}
