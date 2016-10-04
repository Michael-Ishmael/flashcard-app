

import {AssignableType, IAssignable} from "../assignable";
export class AccordianNode {

  type:AssignableType;
  children:AccordianNode[];
  expanded:boolean = false;
  toggleId:string = null;

  constructor(
      public item:IAssignable
  ){
    this.type = item.type;
    this.children = [];
    if(item.type != AssignableType.Flashcard){
      this.toggleId = item.type ==AssignableType.Set ? "setToggle" : "deckToggle";
      this.toggleId += item.id
    }

  }

}

export class CardAccordian {

  expanded:boolean;
  children:AccordianNode[];

  constructor() {
    this.children = [];
  }
}