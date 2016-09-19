import { Injectable } from '@angular/core';

interface ApiCropInstruction{
  orientationId:number;
  x:number;
  y:number;
  x2:number;
  y2:number;
  w:number;
  h:number
}


@Injectable()
export class CardTargetDeviceService {

  creationUrl:string = "";

  constructor() { }

}
