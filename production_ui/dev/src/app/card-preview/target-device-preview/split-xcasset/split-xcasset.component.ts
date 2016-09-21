import {Component, OnInit, Input, OnChanges, SimpleChange} from '@angular/core';
import {SplitCardTargetDevice} from "../target-device";
import {Flashcard} from "../../../flashcard/flashcard";
import {CroppedImage} from "../../../shared/crop";
import {CroppedImageComponent} from "../../../shared/cropped-image/cropped-image.component";


export class SplitXcassetModel{

  constructor(
      public device:SplitCardTargetDevice,
      public card:Flashcard
  ){ }

}

@Component({
  moduleId: module.id,
  selector: 'split-xcasset',
  templateUrl: 'split-xcasset.component.html',
  styleUrls: ['split-xcasset.component.css'],
  directives: [CroppedImageComponent]
})
export class SplitXcassetComponent implements OnInit, OnChanges {

  @Input() model:SplitXcassetModel;

  lsCroppedImage:CroppedImage;
  ptCroppedImage:CroppedImage;

  constructor() { }

  ngOnInit() {
    var i = 1;
  }

  ngOnChanges(changes:{[propName:string]:SimpleChange}) {
      if(changes.hasOwnProperty("model")){
        var model:SplitXcassetModel = changes["model"].currentValue;
        this.lsCroppedImage = new CroppedImage(model.card.image, model.device.lsCropInstruction.crop, 400);
        this.ptCroppedImage = new CroppedImage(model.card.image, model.device.ptCropInstruction.crop, 400);
      }

  }

}
