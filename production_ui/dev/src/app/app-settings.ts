
import {Injectable} from "@angular/core";
import {Headers} from "@angular/http";

@Injectable()
export class AppSettings {
  apiEndpoint:string = "http://localhost:8001/prod/";
  apiHeaders = new Headers({
    'Content-Type': 'application/json',
    'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='});
}