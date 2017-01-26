import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {DeckSet} from "../deck-set";
import {SoundControlComponent} from "../../shared/sound-control/sound-control.component";


@Component({
  moduleId: module.id,
  selector: 'deck-set-form',
  templateUrl: 'deck-set-form.component.html',
  styleUrls: ['deck-set-form.component.css'],
  directives: [SoundControlComponent]
})
export class DeckSetFormComponent implements OnInit {
  @Input() model:DeckSet;
  @Output() onUpdated = new EventEmitter<DeckSet>();
  @Output() onDecksetAdded = new EventEmitter<DeckSet>();
  @Output() onDeleted = new EventEmitter<DeckSet>();
  @Output() onCancelled = new EventEmitter<DeckSet>();
  isNew:boolean;

  submitted = false;

  onSubmit() {
    this.submitted = true;
    if(this.isNew){
      this.onDecksetAdded.emit(this.model);
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
      this.model = new DeckSet(-1, 0, null, null, 0)
    }
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }


  constructor() { }

}
