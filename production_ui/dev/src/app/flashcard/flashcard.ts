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
      public complete:boolean,
      public status:CardStatus
  ){
    this.type = AssignableType.Flashcard;
  }
}


export class FlashcardDetail extends Flashcard{

  public type:AssignableType;
  public ts_ls_x:number;
  public ts_ls_w:number;
  public ts_ls_y:number;
  public ts_ls_h:number;
  public ts_pt_x:number;
  public ts_pt_w:number;
  public ts_pt_y:number;
  public ts_pt_h:number;
  public ns_ls_x:number;
  public ns_ls_w:number;
  public ns_ls_y:number;
  public ns_ls_h:number;
  public ns_pt_x:number;
  public ns_pt_w:number;
  public ns_pt_y:number;
  public ns_pt_h:number;

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
}

export class CropImage {
  image:string;
  x:number;
  y:number;
  w:number;
  h:number;
}
