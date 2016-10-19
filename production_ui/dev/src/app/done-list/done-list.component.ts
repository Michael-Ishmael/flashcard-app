import { Component, OnInit } from '@angular/core';
import {Flashcard} from "../flashcard/flashcard";
import {FlashcardService, CardStatus} from "../flashcard/flashcard.service";
import {CardPreviewComponent} from "../card-preview/card-preview.component";
import {CardAccordianComponent} from "../shared/card-accordian/card-accordian.component";

@Component({
  moduleId: module.id,
  selector: 'app-done-list',
  templateUrl: 'done-list.component.html',
  styleUrls: ['done-list.component.css'],
  directives: [CardAccordianComponent, CardPreviewComponent]
})
export class DoneListComponent implements OnInit {

  items:Flashcard[];
  selectedItem:Flashcard = null;
  //viewManager = new DeploymentViewManager();
  errorMessage:any;

  constructor(
      private flashcardService:FlashcardService
  ) {

  }

  getItems(){

    this.flashcardService.getItems(-1, CardStatus.Deployed)
        .subscribe(
            items => this.items = items,
            error => this.errorMessage = <any>error
        );
  };

  selectItem(item:Flashcard){
    this.selectedItem = item;
  }

  ngOnInit() {
    this.getItems();
  }
}
