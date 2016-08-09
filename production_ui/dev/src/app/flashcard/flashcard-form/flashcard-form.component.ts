import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Flashcard} from "../flashcard";
import {SoundControlComponent} from "../../shared/sound-control/sound-control.component";

@Component({
  moduleId: module.id,
  selector: 'flashcard-form',
  templateUrl: 'flashcard-form.component.html',
  styleUrls: ['flashcard-form.component.css'],
  directives: [SoundControlComponent]
})
export class FlashcardFormComponent implements OnInit {

  @Input() model:Flashcard;
  @Output() onUpdated = new EventEmitter<Flashcard>();
  @Output() onAdded = new EventEmitter<Flashcard>();
  @Output() onDeleted = new EventEmitter<Flashcard>();
  @Output() onCancelled = new EventEmitter<Flashcard>();
  isNew:boolean;

  submitted = false;

  onSubmit() {
    this.submitted = true;
    if(this.isNew){
      this.onAdded.emit(this.model);
    } else {
      this.onUpdated.emit(this.model);
    }
  }

  onDelete() {
    this.submitted = true;
    this.onDeleted.emit(this.model)
  }

  onCancel() {
    this.onCancelled.emit(this.model)
  }

  ngOnInit():any {
    if(!this.model) {
      this.isNew = true;
      this.model = new Flashcard(-1, 0, null, null, null, 0)
    }
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }

}
