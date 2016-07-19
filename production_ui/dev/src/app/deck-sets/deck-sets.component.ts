import { Component, OnInit } from '@angular/core';
import {DeckSetService} from "./deck-set.service";
import {DeckSet} from "./deck-set";
import {BUTTON_DIRECTIVES} from 'ng2-bootstrap';

@Component({
  moduleId: module.id,
  selector: 'app-deck-sets',
  templateUrl: 'deck-sets.component.html',
  styleUrls: ['deck-sets.component.css'],
  directives: [BUTTON_DIRECTIVES]
})
export class DeckSetsComponent implements OnInit {
  deckSets:DeckSet[];
  errorMessage:any;

  selectedDeckSet:DeckSet;
  editing:boolean;
  creating:boolean;

  constructor(
      private deckSetService:DeckSetService
  ) {}

  getDeckSets(){
    this.deckSetService.getDeckSets()
        .subscribe(
            sets => this.deckSets = sets,
            error => this.errorMessage = <any>error
        )
  }

  selectDeckSet(deckSet:DeckSet){
    this.selectedDeckSet = deckSet;
  }

  addNewDeckSet(){

    this.selectedDeckSet = new DeckSet(-1, '', '', this.deckSets.length);
    this.creating = true;
    this.editing =true;
    this.deckSets.push(this.selectedDeckSet);
  }

  deleteDeckSet(deckSet:DeckSet){
    this.deckSetService.delete(deckSet)
      .subscribe(r => this.removeDeckSet(deckSet));

  }

  private removeDeckSet(deckSet:DeckSet):void {

    var indexToDelete = -1;
    for (var i = 0; i < this.deckSets.length; i++) {
      var loopSetting = this.deckSets[i];
      if(loopSetting.id == deckSet.id){
        indexToDelete = i;
        break;
      }
    }
    if(indexToDelete > -1){
      this.deckSets.splice(indexToDelete, 1)
    }

  }

  cancelCreate(){
    this.deckSets.pop();
    this.creating = false;
    this.editing = false;
    this.selectedDeckSet = null;
  }

  editDeckSet(deckSet:DeckSet){
    if(this.selectedDeckSet !== deckSet){
       this.selectDeckSet(deckSet)
    }
    this.editing = true;
  }

  saveDeckSet(){
    if(this.selectedDeckSet){
      this.deckSetService.save(this.selectedDeckSet, this.creating)
          .subscribe(s => this.saveIfNew(s, this))
    }
  }

  private saveIfNew(savedSet:DeckSet, comp:DeckSetsComponent){
    if(comp.creating){
      this.deckSets.push(savedSet);
      comp.creating = false;
    }
    comp.editing = false;
  }

  ngOnInit() {
    this.getDeckSets()
  }


}
