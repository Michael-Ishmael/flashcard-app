"use strict";
//import { XHRBackend } from '@angular/http';
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var core_1 = require('@angular/core');
var _1 = require('./app/');
var app_routes_1 = require('./app/app.routes');
if (_1.environment.production) {
    core_1.enableProdMode();
}
platform_browser_dynamic_1.bootstrap(_1.AppComponent, [
    forms_1.disableDeprecatedForms(),
    forms_1.provideForms(),
    app_routes_1.APP_ROUTER_PROVIDERS,
    http_1.HTTP_PROVIDERS])
    .catch(function (err) { return console.error(err); });
;
//# sourceMappingURL=main.js.map