import { Injectable } from '@angular/core';
import { Fso } from './fso';
import {Http, Response, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Rx";


@Injectable()
export class FolderService {

    private foldersUrl = 'http://localhost:8000/prod/folders/';  // URL to web api

    constructor(private http: Http) { }

    getFolderRoot(): Observable<Fso> {
        return this.http.get(this.foldersUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response):Fso {
        let body = res.json();
        return body;
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