//import { XHRBackend } from '@angular/http';
import { disableDeprecatedForms, provideForms } from '@angular/forms'
import { HTTP_PROVIDERS } from '@angular/http';


import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppComponent, environment } from './app/';
import { APP_ROUTER_PROVIDERS } from './app/app.routes';
//import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';

if (environment.production) {
  enableProdMode();
}

bootstrap(AppComponent, [
  disableDeprecatedForms(),
  provideForms(),
  APP_ROUTER_PROVIDERS,
  HTTP_PROVIDERS
  ]
).catch((err: any) => console.error(err));

