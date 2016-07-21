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

    private setsUrl = 'http://localhost:8000/prod/sets/';
    private decksUrl = 'http://localhost:8000/prod/decks/';

    constructor(private http: Http) { }

    getDeckSets(setId:number = -1): Observable<DeckSet[]> {
        var url:string;
        if(setId > -1){
            url = `${this.decksUrl}?set_id=${setId}`;
        } else {
            url = this.setsUrl;
        }
        return this.http.get(url)
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
            .delete(this.setsUrl + deckSet.id + '/', {headers: headers})
            .catch(this.handleError);
    }

    // Add new DeckSet
    private post(deckSet: DeckSet): Observable<DeckSet> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='});
        var item = DeckSetService.deckSetToApiSet(deckSet);
        return this.http
            .post(this.setsUrl, JSON.stringify(item), {headers: headers})
            .map(function(res){
                var item = res.json();
                return DeckSetService.apiSetToDeckSet(item as IApiSet)
            })
            .catch(this.handleError);
    }

    // Update existing DeckSets
    private put(deckSet: DeckSet): Observable<DeckSet> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `${this.setsUrl}${deckSet.id}/`;
        var item = DeckSetService.deckSetToApiSet(deckSet);
        return this.http
            .put(url, JSON.stringify(item), {headers: headers})
            .map(() => deckSet)
            .catch(this.handleError);
    }

    private extractData(res: Response):DeckSet[] {
        let body = res.json();
        return body.map(DeckSetService.apiSetToDeckSet);
    }

    private static apiSetToDeckSet(r:IApiSet):DeckSet{
        return new DeckSet(r.set_id, r.name, r.icon, r.display_order);
    }

    private static deckSetToApiSet(d:DeckSet):IApiSet{
        return {set_id: d.id, name:d.name, icon:d.icon, display_order:d.displayOrder};
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

