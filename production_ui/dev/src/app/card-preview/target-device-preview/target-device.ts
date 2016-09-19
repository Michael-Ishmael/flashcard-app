import {AspectRatio} from "../../shared/crop";

export class TargetDevice {

  constructor(public id:number,
              public aspectRatio:AspectRatio,
              public name:string,
              public width:number,
              public height:number,
              public idiom:string,
              public scale:string,
              public subType:string) {
  }
}

export class CropInstruction {

  constructor(public orientationId:number,
              public x:number,
              public y:number,
              public x2:number,
              public y2:number,
              public w:number,
              public h:number) {
  }

}

export class CardTargetDeviceBase{

  constructor(public id:number,
              public cardId:number,
              public targetDeviceId:number){}

}

export class SplitCardTargetDevice {

  public croppingInstructions:CropInstruction[];

  constructor(public id:number,
              public cardId:number,
              public targetDeviceId:number,
              public lsXcassetName:string,
              public ptXcassetName:string,
              public lsCropX:number,
              public lsCropY:number,
              public lsCropW:number,
              public lsCropH:number,
              public ptCropX:number,
              public ptCropY:number,
              public ptCropW:number,
              public ptCropH:number) {

    this.croppingInstructions = [];
  }

}

export class CombinedCardTargetDevice{

}
