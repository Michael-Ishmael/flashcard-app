import {Component, OnInit, Input} from '@angular/core';
import {CropImage} from "../../flashcard/flashcard";
import {InitializeJcrop} from "../initialize-jcrop.directive";
import {Crop} from "../crop";

@Component({
  moduleId: module.id,
  selector: 'img-cropper',
  templateUrl: 'img-cropper.component.html',
  styleUrls: ['img-cropper.component.css'],
  directives: [InitializeJcrop]
})
export class ImgCropperComponent implements OnInit {

  @Input()
  image:string;

  @Input()
  crop:Crop;

  constructor() { }

  ngOnInit() {

  }

  onCropSelected(crop:Crop){
    console.log(crop);
  }

}
