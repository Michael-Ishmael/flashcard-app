import { Injectable } from '@angular/core';
import {Fso} from "../assignment/folder-structure/fso";
import {Http, Headers} from "@angular/http";
import {AppSettings} from "../app-settings";
import {Observable} from "rxjs/Rx";

export class DeploymentResult{

  constructor(
    public deployed:boolean,
    public status:string,
    public xcassetFolder:Fso
  ){  }

}


@Injectable()
export class DeployCardService {

  deploymentUrl: string = "";
  soundDeploymentUrl: string = "";
  fullDeploymentUrl: string = "";

  constructor(private http: Http,
              private appSettings: AppSettings) {
    this.deploymentUrl = appSettings.apiEndpoint + 'deployment/images';
    this.soundDeploymentUrl = appSettings.apiEndpoint + 'deployment/sounds';
    this.fullDeploymentUrl = appSettings.apiEndpoint + 'deployment';
  }


  getDeploymentStatus(cardId:number) : Observable<DeploymentResult>{

    var url = `${this.deploymentUrl}/${cardId}/`;
    return this.http.get(url)
      .map(function (res) {
        var obj = res.json() as DeploymentResult;
        return obj;
      })
      .catch(this.handleError);
  }

  hardDeployCard(cardId:number) : Observable<DeploymentResult>{
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='});
    var data = JSON.stringify({cardid: cardId});
    return this.http.post(this.fullDeploymentUrl, data , {headers: headers})
      .map(function (res) {
        var obj = res.json() as DeploymentResult;
        return obj;
      })
      .catch(this.handleError);
  }

  deployCard(cardId:number) : Observable<DeploymentResult>{
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='});
    var data = JSON.stringify({cardid: cardId});
    return this.http.post(this.deploymentUrl, data , {headers: headers})
      .map(function (res) {
        var obj = res.json() as DeploymentResult;
        return obj;
      })
      .catch(this.handleError);
  }

  reDeployCard(cardId:number) : Observable<DeploymentResult>{
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='});
    var url = `${this.deploymentUrl}/${cardId}/`;
    return this.http.put(url, {headers: headers})
      .map(function (res) {
        var obj = res.json() as DeploymentResult;
        return obj;
      })
      .catch(this.handleError);
  }

  reDeployXcasset(cardId:number) : Observable<DeploymentResult>{
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='});
    var url = `${this.deploymentUrl}/${cardId}/`;
    var data = JSON.stringify({xcassetOnly: true});
    return this.http.put(url, data, {headers: headers})
        .map(function (res) {
          var obj = res.json() as DeploymentResult;
          return obj;
        })
        .catch(this.handleError);
  }

  getSoundDeploymentStatus(cardId:number) : Observable<DeploymentResult>{

    var url = `${this.soundDeploymentUrl}/${cardId}/`;
    return this.http.get(url)
        .map(function (res) {
          var obj = res.json() as DeploymentResult;
          return obj;
        })
        .catch(this.handleError);
  }

  deploySoundForCard(cardId:number) : Observable<DeploymentResult>{
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='});
    var data = JSON.stringify({cardid: cardId});
    return this.http.post(this.soundDeploymentUrl, data , {headers: headers})
        .map(function (res) {
          var obj = res.json() as DeploymentResult;
          return obj;
        })
        .catch(this.handleError);
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
