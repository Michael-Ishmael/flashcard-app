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

  public radioModel:string = "middle";

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

  ngOnInit() {
    this.getDeckSets()
  }


}
