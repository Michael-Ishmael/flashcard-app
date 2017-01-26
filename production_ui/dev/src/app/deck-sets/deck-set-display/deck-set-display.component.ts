import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {DeckSet} from "../deck-set";
import {SoundControlComponent} from "../../shared/sound-control/sound-control.component";

@Component({
  moduleId: module.id,
  selector: 'deck-set-display',
  templateUrl: 'deck-set-display.component.html',
  styleUrls: ['deck-set-display.component.css'],
  directives: [SoundControlComponent]
})
export class DeckSetDisplayComponent implements OnInit {
  @Input() model:DeckSet;
  @Output() onEdit = new EventEmitter<DeckSet>();

  constructor() { }

  editItem(){
    this.onEdit.emit(this.model);
  }

  ngOnInit() {

  }



}
