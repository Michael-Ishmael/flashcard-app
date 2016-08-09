import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Flashcard} from "../flashcard";
import {SoundControlComponent} from "../../shared/sound-control/sound-control.component";

@Component({
  moduleId: module.id,
  selector: 'flashcard-display',
  templateUrl: 'flashcard-display.component.html',
  styleUrls: ['flashcard-display.component.css'],
  directives: [SoundControlComponent]
})
export class FlashcardDisplayComponent implements OnInit {

  @Input() model:Flashcard;
  @Output() onEdit = new EventEmitter<Flashcard>();

  constructor() { }

  editItem(){
    this.onEdit.emit(this.model);
  }

  ngOnInit() {

  }

}
