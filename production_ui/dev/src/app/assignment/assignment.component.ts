import { Component, OnInit } from '@angular/core';
import {FolderStructureComponent} from "./folder-structure/folder-structure.component";
import {DeckSetsComponent} from "../deck-sets/deck-sets.component";
import {DeckSet} from "../deck-sets/deck-set";

@Component({
  moduleId: module.id,
  selector: 'app-assignment',
  templateUrl: 'assignment.component.html',
  styleUrls: ['assignment.component.css'],
  directives: [FolderStructureComponent, DeckSetsComponent]
})
export class AssignmentComponent implements OnInit {

  selectedSetId:Number = -1;

  constructor() {}

  ngOnInit() {
  }

  onSetSelected(selectedSet:DeckSet){
    if(selectedSet)
      this.selectedSetId = selectedSet.id;
  }

}
