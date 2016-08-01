import {Component, OnInit, Input, Output} from '@angular/core';
import {FlashcardService} from "./flashcard.service";
import {Flashcard} from "./flashcard";

@Component({
  moduleId: module.id,
  selector: 'app-flashcard',
  templateUrl: 'flashcard.component.html',
  styleUrls: ['flashcard.component.css']
})
export class FlashcardComponent implements OnInit {

  @Input() filterId:number = 1;
  flashcards:Flashcard[];
  errorMessage:any;

  selectedFlashcard:Flashcard;
  editing:boolean;
  creating:boolean;

  constructor(
      private flashcardService:FlashcardService
  ) { }

  getFlashCards(){
    if(this.filterId == 0){
      this.flashcards = [];
      return;
    }
    this.flashcardService.getFlashcards(this.filterId)
        .subscribe(
            cards => this.flashcards = cards,
            error => this.errorMessage = <any>error
        )
  }

  selectFlashcard(flashcard:Flashcard){
    this.selectedFlashcard = flashcard;
  }

  ngOnInit() {
    this.getFlashCards();
  }

}
