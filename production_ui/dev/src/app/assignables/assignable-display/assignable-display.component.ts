import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {IAssignable} from "../../shared/assignable";
import {SoundControlComponent} from "../../shared/sound-control/sound-control.component";

@Component({
  moduleId: module.id,
  selector: 'assignable-display',
  templateUrl: 'assignable-display.component.html',
  styleUrls: ['assignable-display.component.css'],
  directives: [SoundControlComponent]
})
export class AssignableDisplayComponent implements OnInit {

  @Input() model:IAssignable;
  @Output() onEdit = new EventEmitter<IAssignable>();

  constructor() { }

  editItem(){
    this.onEdit.emit(this.model);
  }

  ngOnInit() {

  }

}
