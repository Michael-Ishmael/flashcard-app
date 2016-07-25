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
var fso_1 = require("../fso");
var FsoItemComponent = (function () {
    function FsoItemComponent() {
        this.onSelected = new core_1.EventEmitter();
        this.onUnSelected = new core_1.EventEmitter();
    }
    FsoItemComponent.prototype.toggleExpanded = function () {
        this.model.expanded = !this.model.expanded;
    };
    FsoItemComponent.prototype.toggleSelected = function () {
        this.model.selected = !this.model.selected;
        if (this.model.selected) {
            this.onSelected.emit(this.model);
        }
        else {
            this.onUnSelected.emit(this.model);
        }
    };
    FsoItemComponent.prototype.ngOnInit = function () {
        if (this.model.childFolders || this.model.files) {
            this.isFolder = true;
        }
        else {
            this.isFile = true;
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', fso_1.Fso)
    ], FsoItemComponent.prototype, "model", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], FsoItemComponent.prototype, "onSelected", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], FsoItemComponent.prototype, "onUnSelected", void 0);
    FsoItemComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'fso-item',
            templateUrl: 'fso-item.component.html',
            styleUrls: ['fso-item.component.css'],
            directives: [FsoItemComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], FsoItemComponent);
    return FsoItemComponent;
}());
exports.FsoItemComponent = FsoItemComponent;
//# sourceMappingURL=fso-item.component.js.map