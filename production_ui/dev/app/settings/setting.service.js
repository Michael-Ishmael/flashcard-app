"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require("@angular/http");
require('rxjs/add/operator/toPromise');
var Rx_1 = require("rxjs/Rx");
var SettingService = (function () {
    function SettingService(http) {
        this.http = http;
        this.settingsUrl = 'http://localhost:8000/prod/config/'; // URL to web api
    }
    SettingService.prototype.getSettings = function () {
        return this.http.get(this.settingsUrl)
            .map(this.extractData)
            .catch(this.handleError);
    };
    SettingService.prototype.save = function (hero, asNew) {
        if (asNew === void 0) { asNew = false; }
        if (asNew) {
            return this.post(hero);
        }
        return this.put(hero);
    };
    // Add new Setting
    SettingService.prototype.post = function (hero) {
        var headers = new http_1.Headers({
            'Content-Type': 'application/json' });
        return this.http
            .post(this.settingsUrl, JSON.stringify(hero), { headers: headers })
            .map(this.extractData)
            .catch(this.handleError);
    };
    // Update existing Settings
    SettingService.prototype.put = function (setting) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        var url = this.settingsUrl + "/" + setting.settingKey;
        return this.http
            .put(url, JSON.stringify(setting), { headers: headers })
            .map(function () { return setting; })
            .catch(this.handleError);
    };
    SettingService.prototype.extractData = function (res) {
        var body = res.json();
        return body[0];
    };
    SettingService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Rx_1.Observable.throw(errMsg);
    };
    SettingService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], SettingService);
    return SettingService;
}());
exports.SettingService = SettingService;
//# sourceMappingURL=setting.service.js.map