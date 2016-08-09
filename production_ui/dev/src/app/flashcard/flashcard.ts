import {IAssignable, AssignableType} from "../shared/assignable";

export class Flashcard implements IAssignable{

  public type:AssignableType;

  constructor(
      public id:number,
      public deckId:number,
      public name:string,
      public image:string,
      public sound:string,
      public displayOrder:number
  ){
    this.type = AssignableType.Flashcard;
  }
}
