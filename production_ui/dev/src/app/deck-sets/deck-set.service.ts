import {Injectable} from '@angular/core';
import {DeckSet} from './deck-set';
import {Http, Response, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {Observable, Subject} from "rxjs/Rx";
import {AppSettings} from "../app-settings";
import {AssignableType} from "../shared/assignable";

interface IApiSet {
  deck_id: number,
  set_id: number,
  name: string,
  icon?: string,
  display_order: number
}

@Injectable()
export class DeckSetService {

  private setsUrl: string;
  private decksUrl: string;

  private deckSetEditedSource = new Subject<DeckSet>();
  deckSetEdited$ = this.deckSetEditedSource.asObservable();

  constructor(private http: Http, private appSettings: AppSettings) {
    this.setsUrl = appSettings.apiEndpoint + 'sets/';
    this.decksUrl = appSettings.apiEndpoint + 'decks/';
  }

  getDeckSets(setId: number = -1): Observable<DeckSet[]> {
    var url: string, type: AssignableType;
    if (setId > -1) {
      url = `${this.decksUrl}?set_id=${setId}`;
      type = AssignableType.Set;
    } else {
      url = this.setsUrl;
      type = AssignableType.Deck;
    }
    return this.http.get(url)
      .map( res => this.extractData(res, type))
      .catch(this.handleError);
  }

  getDeck(deckId: number): Observable<DeckSet> {
    var url = `${this.decksUrl}${deckId}/`;
    return this.getDeckSet(url, AssignableType.Deck);
  }

  getSet(setId: number): Observable<DeckSet> {
    var url = `${this.setsUrl}${setId}/`;
    return this.getDeckSet(url, AssignableType.Set);
  }

  private getDeckSet(url: string, type:AssignableType): Observable<DeckSet> {
    return this.http.get(url)
      .map(res =>
        DeckSetService.apiSetToDeckSet(res.json(), type)
      )
      .catch(this.handleError);
  }

  save(deckSet: DeckSet, asNew: boolean = false): Observable<DeckSet> {
    if (asNew) {
      return this.post(deckSet);
    }
    return this.put(deckSet);
  }

  delete(deckSet: DeckSet): Observable<DeckSet> {
    let headers = new Headers({
      //'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='
    });

    return this.http
      .delete(this.setsUrl + deckSet.id + '/', {headers: headers})
      .catch(this.handleError);
  }

  announceDeckSetEdited(deckSet: DeckSet) {
    this.deckSetEditedSource.next(deckSet);
  }

  // Add new DeckSet
  private post(deckSet: DeckSet): Observable<DeckSet> {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='
    });
    var item = DeckSetService.deckSetToApiSet(deckSet);
    var url = deckSet.setId ? this.decksUrl : this.setsUrl;
    var type = deckSet.setId ? AssignableType.Deck : AssignableType.Set;
    return this.http
      .post(url, JSON.stringify(item), {headers: headers})
      .map(function (res) {
        var item = res.json();
        return DeckSetService.apiSetToDeckSet(item as IApiSet, type)
      })
      .catch(this.handleError);
  }

  // Update existing DeckSets
  private put(deckSet: DeckSet): Observable<DeckSet> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var url = deckSet.setId ? this.decksUrl : this.setsUrl;
    url = `${url}${deckSet.id}/`;
    var item = DeckSetService.deckSetToApiSet(deckSet);
    return this.http
      .put(url, JSON.stringify(item), {headers: headers})
      .map(() => deckSet)
      .catch(this.handleError);
  }

  private extractData(res: Response, type:AssignableType): DeckSet[] {
    let body = res.json();
    return body.map(a => DeckSetService.apiSetToDeckSet(a, type));
  }

  private static apiSetToDeckSet(r: IApiSet, type:AssignableType): DeckSet {
    var dSet = new DeckSet(r.deck_id ? r.deck_id : r.set_id, r.deck_id ? r.set_id : null, r.name, r.icon, r.display_order);
    dSet.type = type;
    return dSet;
  }

  private static deckSetToApiSet(d: DeckSet): IApiSet {
    var apiSet = {
      set_id: d.setId ? d.setId : d.id,
      name: d.name,
      display_order: d.displayOrder,
      deck_id: d.setId ? d.id : null
    } as IApiSet;
    if (d.icon) apiSet.icon = d.icon;
    return apiSet;
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

