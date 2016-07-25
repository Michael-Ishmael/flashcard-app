import { Component, OnInit } from '@angular/core';
import {FolderStructureComponent} from "./folder-structure/folder-structure.component";
import {DeckSetsComponent} from "../deck-sets/deck-sets.component";
import {DeckSet} from "../deck-sets/deck-set";
import {Fso} from "./folder-structure/fso";

export enum AssignmentMode{
  None,
  Set,
  Deck,
  Card
}

@Component({
  moduleId: module.id,
  selector: 'app-assignment',
  templateUrl: 'assignment.component.html',
  styleUrls: ['assignment.component.css'],
  directives: [FolderStructureComponent, DeckSetsComponent]
})
export class AssignmentComponent implements OnInit {

  selectMultipleFiles:boolean = false;
  selectedSetId:number = 0;
  selectedDeckId:number = 0;
  assignmentMode:AssignmentMode = AssignmentMode.None;

  constructor() {}

  ngOnInit() {
  }

  onSetSelected(selectedSet:DeckSet){
    if(selectedSet){
      this.selectedSetId = selectedSet.id;
      this.assignmentMode = AssignmentMode.Set;
      this.selectMultipleFiles = false;
    }

  }

  onDeckSelected(selectedDeck:DeckSet){
    if(selectedDeck){
      this.selectedDeckId = selectedDeck.id;
      this.assignmentMode = AssignmentMode.Set;
      this.selectMultipleFiles = true;
    }
  }

  onImageSelected(imageFile:Fso){
    console.log(imageFile.path)
  }
}
