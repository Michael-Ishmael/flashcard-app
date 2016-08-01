import { Component, OnInit } from '@angular/core';
import {FolderStructureComponent} from "./folder-structure/folder-structure.component";
import {DeckSetsComponent} from "../deck-sets/deck-sets.component";
import {DeckSet} from "../deck-sets/deck-set";
import {Fso} from "./folder-structure/fso";
import {FolderStructure} from "./folder-structure/folder-structure";
import {FlashcardComponent} from "../flashcard/flashcard.component";

@Component({
  moduleId: module.id,
  selector: 'app-assignment',
  templateUrl: 'assignment.component.html',
  styleUrls: ['assignment.component.css'],
  directives: [FolderStructureComponent, DeckSetsComponent, FlashcardComponent]
})
export class AssignmentComponent implements OnInit {

  selectedSet:DeckSet = null;
  selectedDeck:DeckSet = null;
  assignmentMode:AssignmentMode = AssignmentMode.None;
  folderStructure:FolderStructure = new FolderStructure(null, false, false);


  constructor() {}

  ngOnInit() {
  }

  onSetSelected(selectedSet:DeckSet){
    if(selectedSet){
      this.selectedSet = selectedSet;
      this.assignmentMode = AssignmentMode.Set;

    }

  }

  onSetEditing(selectedSet:DeckSet){
    if(selectedSet){
      this.selectedSet = selectedSet;
      this.assignmentMode = AssignmentMode.Set;
      this.folderStructure.canSelectMultipleFiles = false;
      this.folderStructure.enabled = true;
      this.folderStructure.target = "Set Icon";
    }
  }

  onDeckSelected(selectedDeck:DeckSet){
    if(selectedDeck){
      this.selectedDeck = selectedDeck;
      this.assignmentMode = AssignmentMode.Deck;
    }
  }

  onDeckEditing(selectedDeck:DeckSet){
    if(selectedDeck){
      this.selectedDeck = selectedDeck;
      this.assignmentMode = AssignmentMode.Deck;
      this.folderStructure.canSelectMultipleFiles = false;
      this.folderStructure.enabled = true;
      this.folderStructure.target = "Deck Icon";
    }
  }

  onImageSelected(imageFile:Fso){
    if(this.assignmentMode == AssignmentMode.Set && this.selectedSet != null){
      this.selectedSet.icon = imageFile.relativePath;
    }
    if(this.assignmentMode == AssignmentMode.Deck && this.selectedDeck != null){
      this.selectedDeck.icon = imageFile.relativePath;
    }

  }
}

 enum AssignmentMode{
  None,
  Set,
  Deck,
  Card
}