import {Component, OnInit, Input, Output, EventEmitter, SimpleChange} from '@angular/core';
import {DeckSetService} from "./deck-set.service";
import {DeckSet} from "./deck-set";
import {BUTTON_DIRECTIVES} from 'ng2-bootstrap';
import {DeckSetFormComponent} from "./deck-set-form/deck-set-form.component";
import {DeckSetDisplayComponent} from "./deck-set-display/deck-set-display.component";
import {Observable} from "rxjs";

@Component({
  moduleId: module.id,
  selector: 'app-deck-sets',
  templateUrl: 'deck-sets.component.html',
  styleUrls: ['deck-sets.component.css'],
  directives: [BUTTON_DIRECTIVES, DeckSetFormComponent, DeckSetDisplayComponent]
})
export class DeckSetsComponent implements OnInit {
  @Input() filterId:number = 0;
  @Output() onItemSelected = new EventEmitter<DeckSet>();
  @Output() onItemEditing = new EventEmitter<DeckSet>();
  deckSets:DeckSet[];
  errorMessage:any;

  selectedDeckSet:DeckSet;
  editing:boolean;
  creating:boolean;


  constructor(
      private deckSetService:DeckSetService
  ) {}

  getDeckSets(){
    if(this.filterId == 0){
      this.deckSets = [];
      return;
    }
    this.deckSetService.getDeckSets(this.filterId)
        .subscribe(
            sets => this.deckSets = sets,
            error => this.errorMessage = <any>error
        )
  }

  selectDeckSet(deckSet:DeckSet){
    this.selectedDeckSet = deckSet;
    this.onItemSelected.emit(deckSet);
  }

  addNewDeckSet(){
    if(this.creating) return;
    this.selectedDeckSet = new DeckSet(-1, this.filterId > 0 ? this.filterId : null, '', '', this.deckSets.length + 1);
    this.creating = true;
    this.editing =true;
    this.deckSets.unshift(this.selectedDeckSet);
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

  cancelEdit(){
    this.editing = false;
    if(this.creating){
      this.deckSets.shift();
      this.creating = false;
      this.selectedDeckSet = null;
    }
  }

  editDeckSet(deckSet:DeckSet){
    if(this.selectedDeckSet !== deckSet){
       this.selectDeckSet(deckSet)
    }
    this.editing = true;
    this.deckSetService.announceDeckSetEdited(deckSet);
    this.onItemEditing.emit(deckSet);
  }

  saveDeckSet(deckSet:DeckSet){
    if(deckSet){
      this.deckSetService.save(this.selectedDeckSet, this.creating)
          .subscribe(s => this.saveIfNew(s, this))
    }
  }

  private saveIfNew(savedSet:DeckSet, comp:DeckSetsComponent){
    if(comp.creating){
      this.removeDeckSet(comp.selectedDeckSet);
      this.deckSets.push(savedSet);
      this.onItemSelected.emit(savedSet);
      comp.creating = false;
    }
    comp.editing = false;
  }

  ngOnInit() {
    this.getDeckSets();
    this.deckSetService.deckSetEdited$.subscribe(ds => {
      if(this.editing && this.selectedDeckSet != ds){
        this.cancelEdit();
      }
    });
  }

  ngOnChanges(changes:{[propName:string]:SimpleChange}) {
    if(changes.hasOwnProperty("filterId")){
      this.getDeckSets()
    }
  }

}
