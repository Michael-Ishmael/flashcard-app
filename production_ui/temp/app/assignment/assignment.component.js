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
var folder_structure_component_1 = require("./folder-structure/folder-structure.component");
var deck_sets_component_1 = require("../deck-sets/deck-sets.component");
var AssignmentComponent = (function () {
    function AssignmentComponent() {
        this.selectedSetId = 0;
    }
    AssignmentComponent.prototype.ngOnInit = function () {
    };
    AssignmentComponent.prototype.onSetSelected = function (selectedSet) {
        if (selectedSet)
            this.selectedSetId = selectedSet.id;
    };
    AssignmentComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'app-assignment',
            templateUrl: 'assignment.component.html',
            styleUrls: ['assignment.component.css'],
            directives: [folder_structure_component_1.FolderStructureComponent, deck_sets_component_1.DeckSetsComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AssignmentComponent);
    return AssignmentComponent;
}());
exports.AssignmentComponent = AssignmentComponent;
//# sourceMappingURL=assignment.component.js.map