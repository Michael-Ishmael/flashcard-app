import {Component, OnInit, SimpleChange, Input, NgZone} from '@angular/core';
import {CombinedCardTargetDevice} from "../target-device";
import {Flashcard} from "../../../flashcard/flashcard";
import {CroppedImage, Crop} from "../../../shared/crop";
import {CroppedImageComponent} from "../../../shared/cropped-image/cropped-image.component";

export class CombinedXcassetModel{

  constructor(
    public device:CombinedCardTargetDevice,
    public card:Flashcard
  ){ }

}

@Component({
  moduleId: module.id,
  selector: 'combined-xcasset',
  templateUrl: 'combined-xcasset.component.html',
  styleUrls: ['combined-xcasset.component.css'],
  directives: [CroppedImageComponent]
})
export class CombinedXcassetComponent implements OnInit {

  @Input() model:CombinedXcassetModel;
  combinedCroppedImage:CroppedImage;
  lsCroppedImage:CroppedImage;
  ptCroppedImage:CroppedImage;

  constructor(private ngZone: NgZone) { }

  ngOnInit() {

  }

  ngOnChanges(changes:{[propName:string]:SimpleChange}) {
    if(changes.hasOwnProperty("model")){
      var model:CombinedXcassetModel = changes["model"].currentValue;
      this.combinedCroppedImage = new CroppedImage(model.card.image, model.device.cropInstruction.crop, 400);

      var lsCrop = new Crop(
        model.device.lsCropX,
        model.device.lsCropY,
        model.device.lsCropW,
        model.device.lsCropH
      );

      var ptCrop = new Crop(
        model.device.ptCropX,
        model.device.ptCropY,
        model.device.ptCropW,
        model.device.ptCropH
      );

      this.lsCroppedImage = new CroppedImage(
        model.card.image,
        this.calculateAsCropOfOriginal(lsCrop, model.device.cropInstruction.crop),
        400
      );

      this.ptCroppedImage = new CroppedImage(
        model.card.image,
        this.calculateAsCropOfOriginal(ptCrop, model.device.cropInstruction.crop),
        400
      );
    }

  }

  calculateAsCropOfOriginal(c1:Crop, co:Crop):Crop{
    var x = (c1.x * co.w) + co.x;
    var y = (c1.y * co.h) + co.y;
    var w = c1.w * co.w;
    var h = c1.h * co.h;
    return new Crop(x, y, w, h);
  }

}
