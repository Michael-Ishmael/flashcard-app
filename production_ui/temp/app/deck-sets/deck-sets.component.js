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
var deck_set_service_1 = require("./deck-set.service");
var deck_set_1 = require("./deck-set");
var ng2_bootstrap_1 = require('ng2-bootstrap');
var DeckSetsComponent = (function () {
    function DeckSetsComponent(deckSetService) {
        this.deckSetService = deckSetService;
        this.filterId = 0;
        this.onItemSelected = new core_1.EventEmitter();
    }
    DeckSetsComponent.prototype.getDeckSets = function () {
        var _this = this;
        if (this.filterId == 0) {
            this.deckSets = [];
            return;
        }
        this.deckSetService.getDeckSets(this.filterId)
            .subscribe(function (sets) { return _this.deckSets = sets; }, function (error) { return _this.errorMessage = error; });
    };
    DeckSetsComponent.prototype.selectDeckSet = function (deckSet) {
        this.selectedDeckSet = deckSet;
        this.onItemSelected.emit(deckSet);
    };
    DeckSetsComponent.prototype.addNewDeckSet = function () {
        this.selectedDeckSet = new deck_set_1.DeckSet(-1, this.filterId > 0 ? this.filterId : null, '', '', this.deckSets.length);
        this.creating = true;
        this.editing = true;
        this.deckSets.push(this.selectedDeckSet);
    };
    DeckSetsComponent.prototype.deleteDeckSet = function (deckSet) {
        var _this = this;
        this.deckSetService.delete(deckSet)
            .subscribe(function (r) { return _this.removeDeckSet(deckSet); });
    };
    DeckSetsComponent.prototype.removeDeckSet = function (deckSet) {
        var indexToDelete = -1;
        for (var i = 0; i < this.deckSets.length; i++) {
            var loopSetting = this.deckSets[i];
            if (loopSetting.id == deckSet.id) {
                indexToDelete = i;
                break;
            }
        }
        if (indexToDelete > -1) {
            this.deckSets.splice(indexToDelete, 1);
        }
    };
    DeckSetsComponent.prototype.cancelCreate = function () {
        this.deckSets.pop();
        this.creating = false;
        this.editing = false;
        this.selectedDeckSet = null;
    };
    DeckSetsComponent.prototype.editDeckSet = function (deckSet) {
        if (this.selectedDeckSet !== deckSet) {
            this.selectDeckSet(deckSet);
        }
        this.editing = true;
    };
    DeckSetsComponent.prototype.saveDeckSet = function () {
        var _this = this;
        if (this.selectedDeckSet) {
            this.deckSetService.save(this.selectedDeckSet, this.creating)
                .subscribe(function (s) { return _this.saveIfNew(s, _this); });
        }
    };
    DeckSetsComponent.prototype.saveIfNew = function (savedSet, comp) {
        if (comp.creating) {
            this.removeDeckSet(comp.selectedDeckSet);
            this.deckSets.push(savedSet);
            this.onItemSelected.emit(savedSet);
            comp.creating = false;
        }
        comp.editing = false;
    };
    DeckSetsComponent.prototype.ngOnInit = function () {
        this.getDeckSets();
    };
    DeckSetsComponent.prototype.ngOnChanges = function (changes) {
        if (changes.hasOwnProperty("filterId")) {
            this.getDeckSets();
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], DeckSetsComponent.prototype, "filterId", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], DeckSetsComponent.prototype, "onItemSelected", void 0);
    DeckSetsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'app-deck-sets',
            templateUrl: 'deck-sets.component.html',
            styleUrls: ['deck-sets.component.css'],
            directives: [ng2_bootstrap_1.BUTTON_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [deck_set_service_1.DeckSetService])
    ], DeckSetsComponent);
    return DeckSetsComponent;
}());
exports.DeckSetsComponent = DeckSetsComponent;
//# sourceMappingURL=deck-sets.component.js.map