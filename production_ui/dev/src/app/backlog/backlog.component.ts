import { Component, OnInit } from '@angular/core';
import {FlashcardService, CardStatus} from "../flashcard/flashcard.service";
import {Flashcard} from "../flashcard/flashcard";
import {AssignableDisplayComponent} from "../assignables/assignable-display/assignable-display.component";
import {Router} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'app-backlog',
  templateUrl: 'backlog.component.html',
  styleUrls: ['../assignables/assignable/assignable.component.css', 'backlog.component.css'],
  directives: [AssignableDisplayComponent]
})
export class BacklogComponent implements OnInit {

  items:Flashcard[];
  errorMessage:any;

  constructor(
      private router:Router,
      private flashcardService:FlashcardService
  ) { }

  selectItem(item:Flashcard){
    this.router.navigate(['/crop', item.id])
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
