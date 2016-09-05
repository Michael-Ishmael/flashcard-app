export class Crop {
  constructor(
      public x:number,
      public y:number,
      public w:number,
      public h:number
  ){}

  toCoordArray(){
    return [this.x, this.y, this.w, this.h];
  }
}
