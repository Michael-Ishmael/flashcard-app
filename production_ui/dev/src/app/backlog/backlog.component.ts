import { Component, OnInit } from '@angular/core';
import {FlashcardService, CardStatus} from "../flashcard/flashcard.service";
import {Flashcard} from "../flashcard/flashcard";
import {AssignableDisplayComponent} from "../assignables/assignable-display/assignable-display.component";
import {Router} from "@angular/router";
import {CropComponent} from "../crop/crop.component";

@Component({
  moduleId: module.id,
  selector: 'app-backlog',
  templateUrl: 'backlog.component.html',
  styleUrls: ['../assignables/assignable/assignable.component.css', 'backlog.component.css'],
  directives: [AssignableDisplayComponent, CropComponent]
})
export class BacklogComponent implements OnInit {

  items:Flashcard[];
  selectedItem:Flashcard = null;
  errorMessage:any;

  constructor(
      private router:Router,
      private flashcardService:FlashcardService
  ) { }

  selectItem(item:Flashcard){
    //this.router.navigate(['/crop', item.id])
    this.selectedItem = item;
  }

  onCropComplete(itemId:number){
    if(this.selectedItem && this.selectedItem.id == itemId){
      this.selectedItem.complete = CardStatus.Complete;
      this.flashcardService.save(this.selectedItem);
    }
    this.selectedItem = null;
  }

  getItems(){

    this.flashcardService.getItems(-1, CardStatus.InComplete)
        .subscribe(
            items => this.items = items,
            error => this.errorMessage = <any>error
        )
  };

  ngOnInit() {
    this.getItems();
  }

}
