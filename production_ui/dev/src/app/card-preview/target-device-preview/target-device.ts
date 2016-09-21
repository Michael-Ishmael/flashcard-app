import {AspectRatio, Crop} from "../../shared/crop";

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

  public crop:Crop;

  constructor(public orientationId:number,
              public x:number,
              public y:number,
              public x2:number,
              public y2:number,
              public w:number,
              public h:number) {
    this.crop = new Crop(x, y, x2-x, y2-y);

  }



}

export class CardTargetStatus {
  constructor(
    public cropsExist:boolean,
    public targetsExist:boolean,
    public status:string
  ){}
}

export class CardTargetDeviceBase {

  constructor(public id:number,
              public cardId:number,
              public targetDeviceId:number,
              public typeId) {
  }

}

export class CombinedCardTargetDevice extends CardTargetDeviceBase {

  constructor(public id:number,
              public cardId:number,
              public targetDeviceId:number,
              public xcassetName:string,
              public cropInstruction:CropInstruction,
              public lsCropX:number,
              public lsCropY:number,
              public lsCropW:number,
              public lsCropH:number,
              public ptCropX:number,
              public ptCropY:number,
              public ptCropW:number,
              public ptCropH:number) {
    super(id, cardId, targetDeviceId, 1);

  }

}


export class SplitCardTargetDevice extends CardTargetDeviceBase {

  constructor(public id:number,
              public cardId:number,
              public targetDeviceId:number,
              public lsXcassetName:string,
              public ptXcassetName:string,
              public lsCropInstruction:CropInstruction,
              public ptCropInstruction:CropInstruction) {
    super(id, cardId, targetDeviceId, 2);
  }

}

