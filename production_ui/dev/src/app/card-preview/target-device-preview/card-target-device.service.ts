import {Injectable} from '@angular/core';
import {AppSettings} from "../../app-settings";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {CardTargetDeviceBase} from "./target-device";

interface ApiCropInstruction {
  orientationId: number;
  x: number;
  y: number;
  x2: number;
  y2: number;
  w: number;
  h: number
}

interface ApiCardTargetDevice {
  id: number;
  cardId: number;
  targetDeviceId: number;
  lsXcassetName: string;
  ptXcassetName: string;
  lsCropX: number;
  lsCropY: number;
  lsCropW: number;
  lsCropH: number;
  ptCropX: number;
  ptCropY: number;
  ptCropW: number;
  ptCropH: number;
  croppingInstructions: ApiCropInstruction[]
}

@Injectable()
export class CardTargetDeviceService {

  cardTargetUrl: string = "";

  constructor(private http: Http,
              private appSettings: AppSettings) {
    this.cardTargetUrl = appSettings.apiEndpoint + 'cardtargetdevices/'
  }

  getItems(cardId: number = -1, deviceId: number = 1): Observable<CardTargetDeviceBase[]> {
    var url: string;
    url = this.cardTargetUrl;
    if (cardId > -1) url += `?card_id=${cardId}`;
    if (deviceId > -1) {
      var prefix = cardId > -1 ? "&" : "?";
      url += `${prefix}device_id=${deviceId}`;
    }
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response): CardTargetDeviceBase[] {
    let body = res.json() as ApiCardTargetDevice[];
    return body.map((c) => CardTargetDeviceService.mapTargetDeviceFromApi(c as ApiCardTargetDevice));
  }

  private static mapTargetDeviceFromApi(targetDevice: ApiCardTargetDevice): CardTargetDeviceBase {
    // var aspectRatio = new AspectRatio(targetDevice.aspectRatioId, targetDevice.width, targetDevice.height);
    // return new TargetDevice(targetDevice.id, aspectRatio, targetDevice.name, targetDevice.width
    //   , targetDevice.height, targetDevice.idiom, targetDevice.scale, targetDevice.subType)
    return null;
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

}
