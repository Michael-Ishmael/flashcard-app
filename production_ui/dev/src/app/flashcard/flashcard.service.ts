import { Injectable } from '@angular/core';
import {AppSettings} from "../app-settings";
import {Flashcard} from "./flashcard";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {AssignableService} from "../shared/assignable-service";
import {AssignableType} from "../shared/assignable";

export enum CardStatus{
  Any = -1,
  UnAssigned = 0,
  PreCrop = 1,
  PreDeploy = 2,
  Deployed = 3
}

@Injectable()
export class FlashcardService extends  AssignableService<Flashcard>{

  protected flashcardsUrl:string;

  constructor(private http: Http, private appSettings:AppSettings) {
    super();
    this.flashcardsUrl = appSettings.apiEndpoint + 'cards/';
  }

  getItem(id:number){
    var url = `${this.flashcardsUrl}${id}`;
    return this.http.get(url)
        .map(function(res){
          return res.json() as Flashcard;
        })
        .catch(this.handleError);
  }

  getItems(filterId:number = -1, status:CardStatus = CardStatus.Any): Observable<Flashcard[]>{
    var url:string;
    url = this.flashcardsUrl;
    if(filterId > -1) url += `?deck_id=${filterId}`;
    if(status != CardStatus.Any){
      url += filterId > -1 ? '&' : '?';
      url += `status=${status}`;
    }

    return this.http.get(url)
        .map(this.extractData)
        .catch(this.handleError);
  }

  getFlashcards(deckId:number = -1): Observable<Flashcard[]> {
    var url:string;
    url = `${this.flashcardsUrl}?deck_id=${deckId}`;
    return this.http.get(url)
        .map(this.extractData)
        .catch(this.handleError);
  }

  private extractData(res: Response):Flashcard[] {
    let body = res.json() as Flashcard[] ;
    body.forEach(function (card:Flashcard) {
      card.type = AssignableType.Flashcard;
    });
    return body;
  }


  save(flashcard: Flashcard, asNew:boolean = false): Observable<Flashcard>  {
    if (asNew) {
      return this.post(flashcard);
    }
    return this.put(flashcard);
  }

  delete(flashcard: Flashcard): Observable<Flashcard> {
    let headers = new Headers({
      //'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='});

    return this.http
        .delete(this.flashcardsUrl + flashcard.id + '/', {headers: headers})
        .catch(this.handleError);
  }

  announceItemEdited(flashcard: Flashcard){
    this.itemEditedSource.next(flashcard);
  }

  // Add new Flashcard
  private post(flashcard: Flashcard): Observable<Flashcard> {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='});
    var url = this.flashcardsUrl;
    return this.http
        .post(url, JSON.stringify(flashcard), {headers: headers})
        .map(function(res){
          var item = res.json();
          return item;
        })
        .catch(this.handleError);
  }

  // Update existing Flashcards
  private put(flashcard: Flashcard): Observable<Flashcard> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var url = this.flashcardsUrl;
    url = `${url}${flashcard.id}/`;
    return this.http
        .put(url, JSON.stringify(flashcard), {headers: headers})
        .map(() => flashcard)
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


//
// @Injectable()
// export class FlashcardDetailService extends  AssignableService<FlashcardDetail>{
//
//   private flashcardsUrl:string;
//
//   constructor(private http: Http, private appSettings:AppSettings) {
//     super();
//     this.flashcardsUrl = appSettings.apiEndpoint + 'carddetails/';
//   }
//
//   getItem(id:number){
//     var url = `${this.flashcardsUrl}${id}`;
//     return this.http.get(url)
//         .map(function(res){
//           return res.json() as Flashcard;
//         })
//         .catch(this.handleError);
//   }
//
//   getItems(filterId:number = -1, status:CardStatus = CardStatus.Any): Observable<FlashcardDetail[]>{
//     var url:string;
//     url = this.flashcardsUrl;
//     if(filterId > -1) url += `?deck_id=${filterId}`;
//     if(status != CardStatus.Any){
//       url += filterId > -1 ? '&' : '?';
//       url += `complete=${status}`;
//     }
//
//     return this.http.get(url)
//         .map(this.extractData)
//         .catch(this.handleError);
//   }
//
//   getFlashcards(deckId:number = -1): Observable<Flashcard[]> {
//     var url:string;
//     url = `${this.flashcardsUrl}?deck_id=${deckId}`;
//     return this.http.get(url)
//         .map(this.extractData)
//         .catch(this.handleError);
//   }
//
//   private extractData(res: Response):FlashcardDetail[] {
//     let body = res.json() as FlashcardDetail[] ;
//     body.forEach(function (card:FlashcardDetail) {
//       card.type = AssignableType.Flashcard;
//     });
//     return body;
//   }
//
//
//   save(flashcard: FlashcardDetail, asNew:boolean = false): Observable<FlashcardDetail>  {
//     if (asNew) {
//       return this.post(flashcard);
//     }
//     return this.put(flashcard);
//   }
//
//   delete(flashcard: FlashcardDetail): Observable<FlashcardDetail> {
//     let headers = new Headers({
//       //'Content-Type': 'application/json',
//       'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='});
//
//     return this.http
//         .delete(this.flashcardsUrl + flashcard.id + '/', {headers: headers})
//         .catch(this.handleError);
//   }
//
//   announceItemEdited(flashcard: FlashcardDetail){
//     this.itemEditedSource.next(flashcard);
//   }
//
//   // Add new Flashcard
//   private post(flashcard: Flashcard): Observable<FlashcardDetail> {
//     let headers = new Headers({
//       'Content-Type': 'application/json',
//       'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='});
//     var url = this.flashcardsUrl;
//     return this.http
//         .post(url, JSON.stringify(flashcard), {headers: headers})
//         .map(function(res){
//           var item = res.json();
//           return item;
//         })
//         .catch(this.handleError);
//   }
//
//   // Update existing Flashcards
//   private put(flashcard: FlashcardDetail): Observable<FlashcardDetail> {
//     let headers = new Headers();
//     headers.append('Content-Type', 'application/json');
//     var url = this.flashcardsUrl;
//     url = `${url}${flashcard.id}/`;
//     return this.http
//         .put(url, JSON.stringify(flashcard), {headers: headers})
//         .map(() => flashcard)
//         .catch(this.handleError);
//   }
//
//   private handleError(error:any){
//     // In a real world app, we might use a remote logging infrastructure
//     // We'd also dig deeper into the error to get a better message
//     let errMsg = (error.message) ? error.message :
//         error.status ? `${error.status} - ${error.statusText}` : 'Server error';
//     console.error(errMsg); // log to console instead
//     return Observable.throw(errMsg);
//   }
//
// }

