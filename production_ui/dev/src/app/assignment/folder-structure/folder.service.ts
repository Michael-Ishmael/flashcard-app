import { Injectable } from '@angular/core';
import { Fso } from './fso';
import {Http, Response, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Rx";
import {AppSettings} from "../../app-settings";


@Injectable()
export class FolderService {

    private foldersUrl:string;
    private filesPreviewsUrl:string;
    private mediaFilesUrl:string;
    private headers:Headers;

    constructor(private http: Http, private appSettings:AppSettings) {
        this.foldersUrl = appSettings.apiEndpoint + 'folders/';
        this.filesPreviewsUrl = appSettings.apiEndpoint + 'files/previews/';
        this.mediaFilesUrl = appSettings.apiEndpoint + 'mediafiles/';
        this.headers = appSettings.apiHeaders;
    }

    getFolderRoot(filter:string, setFilter:string): Observable<Fso> {

        var url:string = this.foldersUrl;
        if(filter){
          url += "?filter=" + filter.toLowerCase();
          if(setFilter){
            url += "&setFilter=" + setFilter.toLowerCase();
          }
        }

        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    postFileForPreview(file:Fso): Observable<Fso> {

      return this.http
        .post(this.filesPreviewsUrl, JSON.stringify(file), {headers: this.headers})
        .map(this.extractData)
        .catch(this.handleError);
    }

    postMediaFile(file:Fso): Observable<Fso> {

      // if(file.name.indexOf('.png') > -1 || file.name.indexOf('.gif') > -1){
      //   file.media_file_type = 2;
      //
      // } else {
      //   file.media_file_type = 1;
      // }

      return this.http
        .post(this.mediaFilesUrl, JSON.stringify(file), {headers: this.headers})
        .map(this.extractData)
        .catch(this.handleError);
    }

    private extractData(res: Response):Fso {
        let body = res.json();
        if(!body.id && body.media_file_id){
          body.id = body.media_file_id;
        }
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