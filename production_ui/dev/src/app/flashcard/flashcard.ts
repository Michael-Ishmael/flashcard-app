export class Flashcard {
  constructor(
      public id:number,
      public deckId:number,
      public name:string,
      public image:string,
      public sound:string,
      public displayOrder:number
  ){}
}
