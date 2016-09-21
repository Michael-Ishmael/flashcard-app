import { Injectable } from '@angular/core';
import {AppSettings} from "../../app-settings";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {AspectRatio} from "../../shared/crop";
import {TargetDevice} from "./target-device";


class ApiTargetDevice{
  constructor(public id:number,
              public aspectRatioId:number,
              public name:string,
              public width:number,
              public height:number,
              public idiom:string,
              public scale:string,
              public subType:string) {}
}

@Injectable()
export class TargetDeviceService {

  protected cropsUrl:string;

  constructor(
    private http: Http,
    private appSettings:AppSettings
  ) {
    this.cropsUrl = appSettings.apiEndpoint + 'targetdevices/'
  }


  getItem(id:number):Observable<TargetDevice>{
    var url = `${this.cropsUrl}${id}`;
    var that = this;
    return this.http.get(url)
      .map(function(res){
        return TargetDeviceService.mapTargetDeviceFromApi(res.json() as ApiTargetDevice);
      })
      .catch(this.handleError);
  }

  getItems(): Observable<TargetDevice[]>{
    return this.http.get(this.cropsUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response):TargetDevice[] {
    let body = res.json() as ApiTargetDevice[] ;
    return body.map((c) => TargetDeviceService.mapTargetDeviceFromApi(c as ApiTargetDevice));
  }

  private static mapTargetDeviceFromApi(targetDevice:ApiTargetDevice):TargetDevice{
    var aspectRatio = new AspectRatio(targetDevice.aspectRatioId, targetDevice.width, targetDevice.height);
    return new TargetDevice(targetDevice.id, aspectRatio, targetDevice.name, targetDevice.width
        , targetDevice.height, targetDevice.idiom, targetDevice.scale, targetDevice.subType)

  }

  private static mapTargetDeviceToApi(targetDevice:TargetDevice):ApiTargetDevice{
    return {
      id:targetDevice.id,
      aspectRatioId:targetDevice.aspectRatio.id,
      name:targetDevice.name,
      width:targetDevice.width,
      height:targetDevice.height,
      idiom:targetDevice.idiom,
      scale:targetDevice.scale,
      subType:targetDevice.subType
    }
  }

  save(cardCrop: TargetDevice, asNew:boolean = false): Observable<TargetDevice>  {
    if (asNew) {
      return this.post(cardCrop);
    }
    return this.put(cardCrop);
  }

  delete(cardCrop: TargetDevice): Observable<TargetDevice> {
    let headers = new Headers({
      //'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='});

    return this.http
      .delete(this.cropsUrl + cardCrop.id + '/', {headers: headers})
      .catch(this.handleError);
  }

  // Add new TargetDevice
  private post(cardCrop: TargetDevice): Observable<TargetDevice> {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='});
    var url = this.cropsUrl;
    var targetDevice = TargetDeviceService.mapTargetDeviceToApi(cardCrop);
    var that = this;
    return this.http
      .post(url, JSON.stringify(targetDevice), {headers: headers})
      .map(function(res){
        var item = res.json() as ApiTargetDevice;
        return TargetDeviceService.mapTargetDeviceFromApi(item as ApiTargetDevice);
      })
      .catch(this.handleError);
  }

  // Update existing TargetDevices
  private put(cardCrop: TargetDevice): Observable<TargetDevice> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var url = this.cropsUrl;
    url = `${url}${cardCrop.id}/`;
    var targetDevice = TargetDeviceService.mapTargetDeviceToApi(cardCrop);
    var that = this;
    return this.http
      .put(url, JSON.stringify(targetDevice), {headers: headers})
      .map((res) => TargetDeviceService.mapTargetDeviceFromApi(res.json() as ApiTargetDevice))
      .catch(this.handleError);
  }

  private handleError(error:any){
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }


}

