
export enum Orientation{
  Landscape = 1,
  Portrait = 2
}

export class AspectRatio {

  constructor(
    public id:number,
    public longSide:number,
    public shortSide:number){

  }

  getAsFraction(orientation:Orientation):number {
    if(orientation == Orientation.Landscape )
      return this.longSide / this.shortSide;
    return this.shortSide / this.longSide;

  }
}



export class CardCrop{

  private dirty:boolean;

  constructor(
    public id:number,
    public cardId:number,
    public aspectRatioId:number,
    public orientation:Orientation,
    public crop:Crop
  ){}

  public setCrop(crop:Crop){

  }

  public isDirty():boolean{
    return this.dirty;
  }

}

export class Crop {
  constructor(
      public x:number,
      public y:number,
      public w:number,
      public h:number
  ){}

  equals(c:Crop){
    return this.approxSame(this.x , c.x) && this.approxSame(this.y , c.y)
        && this.approxSame(this.w , c.w) && this.approxSame(this.h , c.h)
  }

  private approxSame(a:number, b:number):boolean{
    a = Math.round(a * 100) / 100;
    b = Math.round(b * 100) / 100;
    return a == b;
  }


  multiply(w, h){
    return new Crop(
    this.x * w,
    this.y * h,
    this.w * w,
    this.h * h
    );
  }

  divide(w, h){
    return new Crop(
      Math.round(this.x / w * 100) / 100,
      Math.round(this.y / h * 100) / 100,
      Math.round(this.w / w * 100) / 100,
      Math.round(this.h / h * 100) / 100
    );
  }

  toCoordArray(){
    return [this.x, this.y, this.x + this.w, this.y + this.h];
  }
}
