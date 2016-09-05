import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {IAssignable} from "../../shared/assignable";
import {SoundControlComponent} from "../../shared/sound-control/sound-control.component";

@Component({
  moduleId: module.id,
  selector: 'assignable-form',
  templateUrl: 'assignable-form.component.html',
  styleUrls: ['assignable-form.component.css'],
  directives: [SoundControlComponent]
})
export class AssignableFormComponent implements OnInit {


  @Input() model:IAssignable;
  @Output() onUpdated = new EventEmitter<IAssignable>();
  @Output() onAdded = new EventEmitter<IAssignable>();
  @Output() onDeleted = new EventEmitter<IAssignable>();
  @Output() onCancelled = new EventEmitter<IAssignable>();
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
    if(this.model.id == -1) {
      this.isNew = true;
      //this.model = new Flashcard(-1, 0, null, null, null, 0)
    }
  }


}
