import { Injectable } from '@angular/core';
import {AppSettings} from "../app-settings";
import {Flashcard} from "./flashcard";
import {Http, Response} from "@angular/http";
import {Subject, Observable} from "rxjs/Rx";

@Injectable()
export class FlashcardService {

  private flashcardsUrl:string;

  private flashardEditedSource = new Subject<Flashcard>();
  flashardEdited$ = this.flashardEditedSource.asObservable();

  constructor(private http: Http, private appSettings:AppSettings) {
    this.flashcardsUrl = appSettings.apiEndpoint + 'cards/';
  }

  getFlashcards(deckId:number = -1): Observable<Flashcard[]> {
    var url:string;
    url = `${this.flashcardsUrl}?deck_id=${deckId}`;
    return this.http.get(url)
        .map(this.extractData)
        .catch(this.handleError);
  }

  private extractData(res: Response):Flashcard[] {
    let body = res.json();
    return body;
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
