import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange} from '@angular/core';
import {Flashcard} from "../../flashcard/flashcard";
import {DeckSetService} from "../../deck-sets/deck-set.service";
import {DeckSet} from "../../deck-sets/deck-set";
import {Observable} from "rxjs/Rx";
import {IAssignable, AssignableType} from "../assignable";
import {AccordianNodeComponent} from "./accordian-node/accordian-node.component";
import {AccordianNode, CardAccordian} from "./card-accordian";


@Component({
  moduleId: module.id,
  selector: 'card-accordian',
  templateUrl: 'card-accordian.component.html',
  styleUrls: ['card-accordian.component.css'],
  directives: [AccordianNodeComponent]
})
export class CardAccordianComponent implements OnInit, OnChanges {

  @Input() cardList:Flashcard[];
  @Input() cardCount:number = 0;
  @Output() cardSelected = new EventEmitter<Flashcard>();

  model:CardAccordian;

  constructor(
    private deckSetService:DeckSetService
  ) { }


  ngOnInit() {
    this.reload();
  }

  reload(){
    var sets:DeckSet[];
    var decks:DeckSet[];

    if(this.cardList){
      this.getParentAssignables(AssignableType.Flashcard, this.cardList, (rDecks) => {

        decks = rDecks;
        this.getParentAssignables(AssignableType.Deck, decks, (rSets) => {
          sets = rSets;
          this.makeTree(sets, decks, this.cardList)
        })

      })
    }
  }


  ngOnChanges(changes:{[propName:string]:SimpleChange}) {
    if(changes.hasOwnProperty("cardCount")){
      this.reload();
    }
  }

  selectCard(cardNode:AccordianNode):void{
    this.cardSelected.emit(cardNode.item as Flashcard);
  }

  private makeTree(sets:DeckSet[], decks:DeckSet[], cards:Flashcard[]){
    this.model = new CardAccordian();
    this.model.children = sets.map(s =>
      this.createAccordianNode(s,
        decks.filter(d => d.setId == s.id)
          .map(d => this.createAccordianNode(d, cards.filter(c => c.deckId == d.id).map(
            c => this.createAccordianNode(c, null)
          )))   ));
  }

  private createAccordianNode(assignable:IAssignable, childNodes:AccordianNode[]):AccordianNode{
    var node = new AccordianNode(assignable);
    node.children = childNodes;
    return node;
  }

  private getParentAssignables(type:AssignableType, children:IAssignable[], doneCallback:(parents:DeckSet[]) => void):void{

    var parentIdKey = type == AssignableType.Flashcard ? "deckId" : "setId";
    var serviceGetMethod = type == AssignableType.Flashcard ? "getDeck" : "getSet";
    var arrProp = type == AssignableType.Flashcard ? "decks" : "sets";
    var parentIds = this.getUnique(children.map(c => c[parentIdKey]));
    var deckObservables = [];

    for (var i = 0; i < parentIds.length; i++) {
      var deckId = parentIds[i];
      deckObservables.push(this.deckSetService[serviceGetMethod](deckId));
    }

    Observable.forkJoin(deckObservables)
      .subscribe((pArr:any) => {

          doneCallback(pArr);

        }
      );

  }

  private showDataError(e){
    alert(e.toString())
  }

  private getUnique(arr){
    var u = {}, a = [];
    for(var i = 0, l = arr.length; i < l; ++i){
      if(u.hasOwnProperty(arr[i])) {
        continue;
      }
      a.push(arr[i]);
      u[arr[i]] = 1;
    }
    return a;
  }


}
