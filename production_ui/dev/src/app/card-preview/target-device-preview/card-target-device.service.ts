import {Injectable} from '@angular/core';
import {AppSettings} from "../../app-settings";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {
  CardTargetDeviceBase, CombinedCardTargetDevice, SplitCardTargetDevice, CropInstruction,
  CardTargetStatus
} from "./target-device";

interface ApiCropInstruction {
  orientationId: number;
  x: number;
  y: number;
  x2: number;
  y2: number;
  w: number;
  h: number;
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
  croppingInstructions: ApiCropInstruction[];
}

@Injectable()
export class CardTargetDeviceService {

  cardTargetUrl: string = "";
  cartTargetCreationUrl: string = "";

  constructor(private http: Http,
              private appSettings: AppSettings) {
    this.cardTargetUrl = appSettings.apiEndpoint + 'cardtargetdevices/';
    this.cartTargetCreationUrl = appSettings.apiEndpoint + 'cardtargetdevices/creation/';
  }


  checkTargetStatus(cardId:number) : Observable<CardTargetStatus>{

    var url = `${this.cartTargetCreationUrl}${cardId}/`;
    return this.http.get(url)
      .map(function (res) {
        var obj = res.json() as CardTargetStatus;
        return obj;
      })
      .catch(this.handleError);
  }

  createTargetCrops(cardId:number) : Observable<CardTargetStatus>{
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='});
    var data = JSON.stringify({cardid: cardId});
    return this.http.post(this.cartTargetCreationUrl.slice(0, -1), data , {headers: headers})
      .map(function (res) {
        var obj = res.json() as CardTargetStatus;
        return obj;
      })
      .catch(this.handleError);
  }

  recalcTargetCrops(cardId:number) : Observable<CardTargetStatus>{
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='});
    var url = `${this.cartTargetCreationUrl}${cardId}/`;
    var data = JSON.stringify({cardid: cardId});
    return this.http.put(url, data, {headers: headers})
      .map(function (res) {
        var obj = res.json() as CardTargetStatus;
        return obj;
      })
      .catch(this.handleError);
  }


  getItem(cardId: number = -1, deviceId: number = 1): Observable<CardTargetDeviceBase> {
    var url: string;
    url = this.cardTargetUrl;
    if (cardId > -1) url += `?card_id=${cardId}`;
    if (deviceId > -1) {
      var prefix = cardId > -1 ? "&" : "?";
      url += `${prefix}target_device=${deviceId}`;
    }
    return this.http.get(url)
      .map(function (res) {
        var arr = res.json() as ApiCardTargetDevice[];
        if (arr == null || arr.length == 0) return null;
        return CardTargetDeviceService.mapTargetDeviceFromApi(arr[0]);
      })
      .catch(this.handleError);
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

  private static mapTargetDeviceFromApi(apiTarget: ApiCardTargetDevice): CardTargetDeviceBase {
    if (apiTarget.ptXcassetName)
      return CardTargetDeviceService.mapSplitFromApi(apiTarget);
    return CardTargetDeviceService.mapCombinedFromApi(apiTarget);
  }

  private static mapCombinedFromApi(apiTarget: ApiCardTargetDevice): CombinedCardTargetDevice {
    var ci: CropInstruction = apiTarget.croppingInstructions && apiTarget.croppingInstructions.length
      ? CardTargetDeviceService.mapCropInsFromApi(apiTarget.croppingInstructions[0]) : null;

    var comby = new CombinedCardTargetDevice(
      apiTarget.id,
      apiTarget.cardId,
      apiTarget.targetDeviceId,
      apiTarget.lsXcassetName,
      ci,
      apiTarget.lsCropX,
      apiTarget.lsCropY,
      apiTarget.lsCropW,
      apiTarget.lsCropH,
      apiTarget.ptCropX,
      apiTarget.ptCropY,
      apiTarget.ptCropW,
      apiTarget.ptCropH
    );

    return comby;
  }

  private static mapCropInsFromApi(a: ApiCropInstruction): CropInstruction {
    return new CropInstruction(
      a.orientationId,
      a.x,
      a.y,
      a.x2,
      a.y2,
      a.w,
      a.h
    );
  }

  private static mapSplitFromApi(apiTarget: ApiCardTargetDevice): SplitCardTargetDevice {
    var lsCi: CropInstruction = null, ptCi: CropInstruction = null;
    if (apiTarget.croppingInstructions && apiTarget.croppingInstructions.length) {
      lsCi = apiTarget.croppingInstructions.some(ci => ci.orientationId == 1) ?
        CardTargetDeviceService.mapCropInsFromApi(
          apiTarget.croppingInstructions.filter(ci => ci.orientationId == 1)[0])
        : null;
      ptCi = apiTarget.croppingInstructions.some(ci => ci.orientationId == 2) ?
        CardTargetDeviceService.mapCropInsFromApi(
          apiTarget.croppingInstructions.filter(ci => ci.orientationId == 2)[0])
        : null;
    }
    var split = new SplitCardTargetDevice(
      apiTarget.id,
      apiTarget.cardId,
      apiTarget.targetDeviceId,
      apiTarget.lsXcassetName,
      apiTarget.ptXcassetName,
      lsCi,
      ptCi
    );
    return split;
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
