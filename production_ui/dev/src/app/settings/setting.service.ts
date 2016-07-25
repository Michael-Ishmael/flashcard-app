import { Injectable } from '@angular/core';
import { Setting } from './setting';
import {Http, Response, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Rx";

@Injectable()
export class SettingService {

    private settingsUrl = 'http://localhost:8000/prod/config/';  // URL to web api

    constructor(private http: Http) { }

    getSettings(): Observable<Setting[]> {
        return this.http.get(this.settingsUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    save(setting: Setting, asNew:boolean = false): Observable<Setting>  {
        if (asNew) {
            return this.post(setting);
        }
        return this.put(setting);
    }

    delete(setting: Setting): Observable<Setting> {
        let headers = new Headers({
            //'Content-Type': 'application/json',
            'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='});

        return this.http
            .delete(this.settingsUrl + setting.settingKey + '/', {headers: headers})
            .catch(this.handleError);
    }

    // Add new Setting
    private post(setting: Setting): Observable<Setting> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='});

        return this.http
            .post(this.settingsUrl, JSON.stringify(setting), {headers: headers})
            .map(this.extractData)
            .catch(this.handleError);
    }

    // Update existing Settings
    private put(setting: Setting): Observable<Setting> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `${this.settingsUrl}${setting.settingKey}/`;

        return this.http
            .put(url, JSON.stringify(setting), {headers: headers})
            .map(() => setting)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
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

