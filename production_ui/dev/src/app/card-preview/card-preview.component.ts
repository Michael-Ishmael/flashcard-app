import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Flashcard} from "../flashcard/flashcard";
import {CropsPreviewComponent} from "./crops-preview/crops-preview.component";
import {TargetDevicePreviewComponent} from "./target-device-preview/target-device-preview.component";

export enum PreviewViewMode{
  Crop=1,
  Targets=2,
  CropEdit=3
}

@Component({
  moduleId: module.id,
  selector: 'card-preview',
  templateUrl: 'card-preview.component.html',
  styleUrls: ['card-preview.component.css'],
  directives: [CropsPreviewComponent, TargetDevicePreviewComponent]
})
export class CardPreviewComponent implements OnInit {

  @Input() model:Flashcard;
  @Output() public onCropViewSelected = new EventEmitter<boolean>();

  previewViewMode:PreviewViewMode;

  constructor() { }

  ngOnInit() {
    this.previewViewMode = PreviewViewMode.Crop;
  }

  selectPreviewViewMode(mode:PreviewViewMode){
    this.previewViewMode = mode;
    if(mode == PreviewViewMode.CropEdit)
      this.onCropViewSelected.emit(true);
  }


}
