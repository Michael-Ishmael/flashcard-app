import {IAssignable, AssignableType} from "../shared/assignable";
import {CardStatus} from "./flashcard.service";

export class Flashcard implements IAssignable{

  public type:AssignableType;

  constructor(
      public id:number,
      public deckId:number,
      public name:string,
      public image:string,
      public sound:string,
      public displayOrder:number,
      public status:CardStatus
  ){
    this.type = AssignableType.Flashcard;
  }

  isComplete(){
    return this.deckId > 0 && this.name && this.image && this.sound;
  }
}


/*export class FlashcardDetail extends Flashcard{

  public type:AssignableType;

  constructor(
      public id:number,
      public deckId:number,
      public name:string,
      public image:string,
      public sound:string,
      public displayOrder:number,
      public complete:boolean,
      public status:CardStatus
  ){
    super(id, deckId, name, image, sound, displayOrder, complete, status)
  }
}*/

export class CropImage {
  image:string;
  x:number;
  y:number;
  w:number;
  h:number;
}
