import { Injectable } from '@angular/core';
import {AppSettings} from "../app-settings";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Crop, CardCrop, AspectRatio, Orientation} from "./crop";


interface ApiCrop {
  id:number,
  cardId:number,
  aspectRatioId:number,
  orientationId:number,
  x:number,
  y:number,
  w:number,
  h:number,
}

class AspectRatioProvider {

  private static twelve16:AspectRatio = new AspectRatio(1, 16, 12);
  private static nine16:AspectRatio = new AspectRatio(1, 16, 9);

  static GetForId(aspectRatioId:number){
    if(aspectRatioId == 1){
      return AspectRatioProvider.twelve16;
    }
    else {
      return AspectRatioProvider.nine16;
    }
  }

}

@Injectable()
export class CropService {

  protected cropsUrl:string
  
  constructor(
    private http: Http, 
    private appSettings:AppSettings
  ) {
    this.cropsUrl = appSettings.apiEndpoint + 'crops/'
  }


  getItem(id:number):Observable<CardCrop>{
    var url = `${this.cropsUrl}${id}`;
    var that = this;
    return this.http.get(url)
      .map(function(res){
        return CropService.mapApiCrop(res.json() as ApiCrop);
      })
      .catch(this.handleError);
  }

  getItems(cardId:number = -1): Observable<CardCrop[]>{
    var url:string;
    url = this.cropsUrl;
    if(cardId > -1) url += `?card_id=${cardId}`;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response):CardCrop[] {
    let body = res.json() as ApiCrop[] ;
    return body.map((c) => CropService.mapApiCrop(c));
  }

  private static mapApiCrop(apiCrop:ApiCrop):CardCrop{
    var orientation = apiCrop.orientationId as Orientation;
    var crop = new Crop(apiCrop.x, apiCrop.y, apiCrop.w, apiCrop.h);
    return new CardCrop(apiCrop.id, apiCrop.cardId, apiCrop.aspectRatioId, orientation, crop);
  }

  private static mapCardCrop(cardCrop:CardCrop):ApiCrop{
    return {
      id:cardCrop.id,
      cardId:cardCrop.cardId,
      aspectRatioId:cardCrop.aspectRatioId,
      orientationId:cardCrop.orientation as number,
      x:cardCrop.crop.x,
      y:cardCrop.crop.y,
      w:cardCrop.crop.w,
      h:cardCrop.crop.h
    }
  }

  save(cardCrop: CardCrop, asNew:boolean = false): Observable<CardCrop>  {
    if (asNew) {
      return this.post(cardCrop);
    }
    return this.put(cardCrop);
  }

  delete(cardCrop: CardCrop): Observable<CardCrop> {
    let headers = new Headers({
      //'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='});

    return this.http
      .delete(this.cropsUrl + cardCrop.id + '/', {headers: headers})
      .catch(this.handleError);
  }

  // Add new CardCrop
  private post(cardCrop: CardCrop): Observable<CardCrop> {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='});
    var url = this.cropsUrl;
    var apiCrop = CropService.mapCardCrop(cardCrop);
    var that = this;
    return this.http
      .post(url, JSON.stringify(apiCrop), {headers: headers})
      .map(function(res){
        var item = res.json() as ApiCrop;
        return CropService.mapApiCrop(item);
      })
      .catch(this.handleError);
  }

  // Update existing CardCrops
  private put(cardCrop: CardCrop): Observable<CardCrop> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var url = this.cropsUrl;
    url = `${url}${cardCrop.id}/`;
    var apiCrop = CropService.mapCardCrop(cardCrop);
    var that = this;
    return this.http
      .put(url, JSON.stringify(apiCrop), {headers: headers})
      .map((res) => CropService.mapApiCrop(res.json() as ApiCrop))
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
