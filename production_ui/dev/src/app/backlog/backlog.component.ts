import { Component, OnInit } from '@angular/core';
import {FlashcardService, CardStatus} from "../flashcard/flashcard.service";
import {Flashcard} from "../flashcard/flashcard";
import {AssignableDisplayComponent} from "../assignables/assignable-display/assignable-display.component";
import {Router} from "@angular/router";
import {CropComponent} from "../crop/crop.component";
import {CardPreviewComponent} from "../card-preview/card-preview.component";
import {CardAccordianComponent} from "../shared/card-accordian/card-accordian.component";

@Component({
  moduleId: module.id,
  selector: 'app-backlog',
  templateUrl: 'backlog.component.html',
  styleUrls: ['../assignables/assignable/assignable.component.css', 'backlog.component.css'],
  directives: [AssignableDisplayComponent, CropComponent, CardPreviewComponent, CardAccordianComponent]
})
export class BacklogComponent implements OnInit {

  items:Flashcard[];
  completedItems:Flashcard[];
  selectedItem:Flashcard = null;

  errorMessage:any;
  collapseLists:boolean;
  viewManager = new BacklogViewManager();

  constructor(
      private router:Router,
      private flashcardService:FlashcardService
  ) { }

  selectBacklogItem(item:Flashcard){
    //this.router.navigate(['/crop', item.id])
    this.selectedItem = item;
    this.viewManager.setView(BacklogViewSetting.Cropping)
  }

  onCropModeSelected(){
    this.viewManager.setView(BacklogViewSetting.Cropping)
  }

  selectCompletedItem(item:Flashcard){
    this.selectedItem = item;
    this.viewManager.setView(BacklogViewSetting.Preview)
  }

  onCropComplete(itemId:number){
    if(this.selectedItem && this.selectedItem.id == itemId){
      this.selectedItem.complete = true;
      this.flashcardService.save(this.selectedItem)
          .subscribe(
              saved =>  {var x = 0; } //Do nothing
          );
      this.getItems();
    }
    this.selectedItem = null;
    this.viewManager.setView(BacklogViewSetting.Default)
  }

  getItems(){

    this.flashcardService.getItems(-1, CardStatus.InComplete)
        .subscribe(
            items => this.items = items,
            error => this.errorMessage = <any>error
        );

    this.flashcardService.getItems(-1, CardStatus.Complete)
        .subscribe(
            items => this.completedItems = items,
            error => this.errorMessage = <any>error
        )
  };

  ngOnInit() {
    this.getItems();
  }

}

enum BacklogViewSetting{
  Default,
  Cropping,
  Preview
}

class BacklogViewManager {

  listsCollapsed:boolean;
  showCrops:boolean;
  showPreview:boolean;

  public setView(viewSetting:BacklogViewSetting):void{
    this.listsCollapsed = viewSetting != BacklogViewSetting.Default;
    this.showCrops = viewSetting == BacklogViewSetting.Cropping;
    this.showPreview = viewSetting == BacklogViewSetting.Preview;
  }

}
