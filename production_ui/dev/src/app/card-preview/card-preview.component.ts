import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Flashcard} from "../flashcard/flashcard";
import {CropsPreviewComponent} from "./crops-preview/crops-preview.component";
import {TargetDevicePreviewComponent} from "./target-device-preview/target-device-preview.component";
import {DeployCardService, DeploymentResult} from "./deploy-card.service";

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
  deploying:boolean = false;

  previewViewMode:PreviewViewMode;

  constructor(
    private deploymentService:DeployCardService
  ) { }

  ngOnInit() {
    this.previewViewMode = PreviewViewMode.Crop;
  }

  selectPreviewViewMode(mode:PreviewViewMode){
    this.previewViewMode = mode;
    if(mode == PreviewViewMode.CropEdit)
      this.onCropViewSelected.emit(true);
  }

  hardDeployCard(){
    if(this.model){
      this.deploying = true;
      this.deploymentService.hardDeployCard(this.model.id)
        .subscribe((m:any) => this.deploying = false, e => {
          this.deploying = false;
          alert(e);
      });
    }
  }



}
