import {Component, OnInit} from '@angular/core';
import {FlashcardService, CardStatus} from "./flashcard.service";
import {Flashcard} from "./flashcard";
import {AssignableComponent} from "../shared/assignable-component";
import {AssignableDisplayComponent} from "../assignables/assignable-display/assignable-display.component";
import {AssignableFormComponent} from "../assignables/assignable-form/assignable-form.component";


@Component({
  moduleId: module.id,
  selector: 'card-list',
  templateUrl: '../assignables/assignable/assignable.component.html',
  styleUrls: ['../assignables/assignable/assignable.component.css'],
  directives: [AssignableDisplayComponent, AssignableFormComponent]
})
export class FlashcardComponent extends AssignableComponent<Flashcard> implements OnInit {

  constructor(
      private flashcardService:FlashcardService
  ) {
    super(flashcardService); }

  createItem():Flashcard{
    return new Flashcard(-1, this.filterId > 0 ? this.filterId : null, '', '', '', this.items.length + 1, CardStatus.UnAssigned, '', '');
  }


}
