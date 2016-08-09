export enum AssignableType{
  Flashcard,
  Deck,
  Set
}

export interface IAssignable {
  id:Number;
  name:string;
  image:string;
  displayOrder:number;
  type:AssignableType
}