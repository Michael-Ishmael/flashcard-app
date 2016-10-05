import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FlashcardService, CardStatus} from "../flashcard/flashcard.service";
import {Flashcard} from "../flashcard/flashcard";
import {AssignableDisplayComponent} from "../assignables/assignable-display/assignable-display.component";
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
  selectedItem:Flashcard = null;

  errorMessage:any;


  constructor(
      private router:Router,
      private flashcardService:FlashcardService
  ) { }

  selectBacklogItem(item:Flashcard){
    //this.router.navigate(['/crop', item.id])
    this.selectedItem = item;

  }

  onCropComplete(flashcard:Flashcard){
    if(flashcard && flashcard.status < 2){
      flashcard.status = 2;
      var matching = this.items.findIndex(f => f.id == flashcard.id);
      if(matching > -1){
        this.items.splice(matching, 1)
      }
      this.flashcardService.save(flashcard)
        .subscribe(m => flashcard = m);

    }

    this.selectedItem = null;
  }

  getItems(){

    this.flashcardService.getItems(-1, CardStatus.PreCrop)
        .subscribe(
            items => this.items = items,
            error => this.errorMessage = <any>error
        );
  };

  ngOnInit() {
    this.getItems();
  }

}




