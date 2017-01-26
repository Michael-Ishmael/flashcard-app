export enum AssignableType{
  Flashcard,
  Deck,
  Set
}

export interface IAssignable {
  id:number;
  name:string;
  label:string;
  image:string;
  displayOrder:number;
  type:AssignableType
  isComplete():boolean;
}