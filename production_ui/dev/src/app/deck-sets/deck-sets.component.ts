import { Component, OnInit } from '@angular/core';
import {DeckSetService} from "./deck-set.service";
import {DeckSet} from "./deck-set";

@Component({
  moduleId: module.id,
  selector: 'app-deck-sets',
  templateUrl: 'deck-sets.component.html',
  styleUrls: ['deck-sets.component.css']
})
export class DeckSetsComponent implements OnInit {
  deckSets:DeckSet[];
  errorMessage:any;

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
