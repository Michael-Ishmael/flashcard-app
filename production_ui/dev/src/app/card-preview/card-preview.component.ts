import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Flashcard} from "../flashcard/flashcard";
import {CropsPreviewComponent} from "./crops-preview/crops-preview.component";

@Component({
  moduleId: module.id,
  selector: 'card-preview',
  templateUrl: 'card-preview.component.html',
  styleUrls: ['card-preview.component.css'],
  directives: [CropsPreviewComponent]
})
export class CardPreviewComponent implements OnInit {

  @Input() model:Flashcard;
  @Output() public onCropViewSelected = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }


  selectCropView(){
    this.onCropViewSelected.emit(true);
  }


}
