import { Injectable } from '@angular/core';
import { DeckSet } from './deck-set';
import {Http, Response, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Rx";

interface IApiSet{
    set_id:number,
    name:string,
    icon:string,
    display_order:number
}

@Injectable()
export class DeckSetService {

    private deckSetsUrl = 'http://localhost:8000/prod/sets/';  // URL to web api

    constructor(private http: Http) { }

    getDeckSets(): Observable<DeckSet[]> {
        return this.http.get(this.deckSetsUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    save(deckSet: DeckSet, asNew:boolean = false): Observable<DeckSet>  {
        if (asNew) {
            return this.post(deckSet);
        }
        return this.put(deckSet);
    }

    delete(deckSet: DeckSet): Observable<DeckSet> {
        let headers = new Headers({
            //'Content-Type': 'application/json',
            'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='});

        return this.http
            .delete(this.deckSetsUrl + deckSet.id + '/', {headers: headers})
            .catch(this.handleError);
    }

    // Add new DeckSet
    private post(deckSet: DeckSet): Observable<DeckSet> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='});

        return this.http
            .post(this.deckSetsUrl, JSON.stringify(deckSet), {headers: headers})
            .map(this.extractData)
            .catch(this.handleError);
    }

    // Update existing DeckSets
    private put(deckSet: DeckSet): Observable<DeckSet> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `${this.deckSetsUrl}/${deckSet.id}`;

        return this.http
            .put(url, JSON.stringify(deckSet), {headers: headers})
            .map(() => deckSet)
            .catch(this.handleError);
    }

    private extractData(res: Response):DeckSet[] {
        let body = res.json();
        return body.map(DeckSetService.apiSetToDeckSet);
    }

    private static apiSetToDeckSet(r:IApiSet){
        return new DeckSet(r.set_id, r.name, r.icon, r.display_order);
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

