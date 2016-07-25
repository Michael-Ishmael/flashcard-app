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
var deck_set_1 = require('./deck-set');
var http_1 = require("@angular/http");
require('rxjs/add/operator/toPromise');
var Rx_1 = require("rxjs/Rx");
var DeckSetService = (function () {
    function DeckSetService(http) {
        this.http = http;
        this.setsUrl = 'http://localhost:8000/prod/sets/';
        this.decksUrl = 'http://localhost:8000/prod/decks/';
    }
    DeckSetService.prototype.getDeckSets = function (setId) {
        if (setId === void 0) { setId = -1; }
        var url;
        if (setId > -1) {
            url = this.decksUrl + "?set_id=" + setId;
        }
        else {
            url = this.setsUrl;
        }
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DeckSetService.prototype.save = function (deckSet, asNew) {
        if (asNew === void 0) { asNew = false; }
        if (asNew) {
            return this.post(deckSet);
        }
        return this.put(deckSet);
    };
    DeckSetService.prototype.delete = function (deckSet) {
        var headers = new http_1.Headers({
            //'Content-Type': 'application/json',
            'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM=' });
        return this.http
            .delete(this.setsUrl + deckSet.id + '/', { headers: headers })
            .catch(this.handleError);
    };
    // Add new DeckSet
    DeckSetService.prototype.post = function (deckSet) {
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM=' });
        var item = DeckSetService.deckSetToApiSet(deckSet);
        var url = deckSet.setId ? this.decksUrl : this.setsUrl;
        return this.http
            .post(url, JSON.stringify(item), { headers: headers })
            .map(function (res) {
            var item = res.json();
            return DeckSetService.apiSetToDeckSet(item);
        })
            .catch(this.handleError);
    };
    // Update existing DeckSets
    DeckSetService.prototype.put = function (deckSet) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        var url = deckSet.setId ? this.decksUrl : this.setsUrl;
        url = "" + url + deckSet.id + "/";
        var item = DeckSetService.deckSetToApiSet(deckSet);
        return this.http
            .put(url, JSON.stringify(item), { headers: headers })
            .map(function () { return deckSet; })
            .catch(this.handleError);
    };
    DeckSetService.prototype.extractData = function (res) {
        var body = res.json();
        return body.map(DeckSetService.apiSetToDeckSet);
    };
    DeckSetService.apiSetToDeckSet = function (r) {
        return new deck_set_1.DeckSet(r.deck_id ? r.deck_id : r.set_id, r.deck_id ? r.set_id : null, r.name, r.icon, r.display_order);
    };
    DeckSetService.deckSetToApiSet = function (d) {
        var apiSet = { set_id: d.setId ? d.setId : d.id, name: d.name, display_order: d.displayOrder, deck_id: d.setId ? d.id : null };
        if (d.icon)
            apiSet.icon = d.icon;
        return apiSet;
    };
    DeckSetService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Rx_1.Observable.throw(errMsg);
    };
    DeckSetService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], DeckSetService);
    return DeckSetService;
}());
exports.DeckSetService = DeckSetService;
//# sourceMappingURL=deck-set.service.js.map