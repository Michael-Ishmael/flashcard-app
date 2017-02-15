import { Component, OnInit } from '@angular/core';
import {FlashcardService, CardStatus} from "../flashcard/flashcard.service";
import {Flashcard} from "../flashcard/flashcard";
import {CardAccordianComponent} from "../shared/card-accordian/card-accordian.component";
import {CardPreviewComponent} from "../card-preview/card-preview.component";
import {CropComponent} from "../crop/crop.component";
import {CardStatusPipe} from "./deployment.pipes";

@Component({
  moduleId: module.id,
  selector: 'deployment',
  templateUrl: 'deployment.component.html',
  styleUrls: ['deployment.component.css'],
  directives: [CardAccordianComponent, CropComponent, CardPreviewComponent],
  pipes: [CardStatusPipe]
})
export class DeploymentComponent implements OnInit {

  items:Flashcard[];
  selectedItem:Flashcard = null;
  viewManager = new DeploymentViewManager();
  errorMessage:any;
  
  constructor(
    private flashcardService:FlashcardService
  ) { 
    
  }

  getItems(){

    this.flashcardService.getItems(-1, CardStatus.PreDeploy)
      .subscribe(
        items => this.items = items,
        error => this.errorMessage = <any>error
      );
  };

  ngOnInit() {
    this.getItems();
  }

  onCropComplete(flashcard:Flashcard){
    this.viewManager.setView(DeploymentViewSetting.Preview)
  }

  onCardDeployed(flashcard:Flashcard){
    if(flashcard && flashcard.status == 3){

      var matching = this.items.findIndex(f => f.id == flashcard.id);
      if(matching > -1){
        this.items.splice(matching, 1)
      }
      this.flashcardService.save(flashcard)
        .subscribe(m => flashcard = m);
      this.items = this.items.slice(0);
    }
    this.selectedItem = null;
    this.viewManager.setView(DeploymentViewSetting.Default)
  }

  onCalcModeSelected(){
    this.viewManager.setView(DeploymentViewSetting.Default)
  }


  onCropModeSelected(){
    this.viewManager.setView(DeploymentViewSetting.Cropping)
  }

  selectItem(item:Flashcard){
    this.selectedItem = item;
    this.viewManager.setView(DeploymentViewSetting.Preview)
  }
  
}

enum DeploymentViewSetting{
  Default,
  Cropping,
  Preview
}

class DeploymentViewManager {

  listsCollapsed:boolean;
  showCrops:boolean;
  showPreview:boolean;

  public setView(viewSetting:DeploymentViewSetting):void{
    this.listsCollapsed = viewSetting != DeploymentViewSetting.Default;
    this.showCrops = viewSetting == DeploymentViewSetting.Cropping;
    this.showPreview = viewSetting == DeploymentViewSetting.Preview;
  }

}