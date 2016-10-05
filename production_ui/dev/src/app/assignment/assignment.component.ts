import { Component, OnInit } from '@angular/core';
import {FolderStructureComponent} from "./folder-structure/folder-structure.component";
import {DeckSetsComponent} from "../deck-sets/deck-sets.component";
import {DeckSet} from "../deck-sets/deck-set";
import {Fso, MediaFileType} from "./folder-structure/fso";
import {FolderStructure} from "./folder-structure/folder-structure";
import {FlashcardComponent} from "../flashcard/flashcard.component";
import {Flashcard} from "../flashcard/flashcard";
import {IAssignable, AssignableType} from "../shared/assignable";
import {FlashcardService} from "../flashcard/flashcard.service";

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
  selectedCard:Flashcard = null;
  selectedItem:IAssignable;


  constructor(
    private flashcardService:FlashcardService
  ) {}

  debug(){
    this.folderStructure.enabled = !this.folderStructure.enabled;
  }

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

  onCardSelected(selectedCard:Flashcard){
    if(selectedCard){
      this.selectedCard = selectedCard;
      this.assignmentMode = AssignmentMode.Card;
    }
  }

  onItemEditing(item:IAssignable){
    this.selectedItem = item;
    if(item.type == AssignableType.Flashcard){
      this.selectedCard = item as Flashcard;
      this.assignmentMode = AssignmentMode.Card;
      this.folderStructure.enabled = true;
      this.folderStructure.target = "Flashcard Image and Sound"
    }
  }

  onImageSelected(file:Fso){
    if(this.assignmentMode == AssignmentMode.Set && this.selectedSet != null){
      this.selectedSet.icon = file.relativePath;
    }
    if(this.assignmentMode == AssignmentMode.Deck && this.selectedDeck != null){
      this.selectedDeck.icon = file.relativePath;
    }
    if(this.assignmentMode == AssignmentMode.Card && this.selectedCard != null){
      var update = false;
      if(file.media_file_type == MediaFileType.Sound ){
        this.selectedCard.sound = file.relativePath;
        if(this.selectedCard.isComplete() && this.selectedCard.status < 1){
          update = true;
          this.selectedCard.status = 1;
        }
      } else {
        this.selectedCard.image = file.relativePath;
        this.selectedCard.status = 1;
        update = true;
      }
      if(update){
        this.flashcardService.save(this.selectedCard)
          .subscribe(c => this.selectedCard = c)
      }
    }
  }
}

 enum AssignmentMode{
  None,
  Set,
  Deck,
  Card
}