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
var folder_service_1 = require('./folder.service');
var fso_item_component_1 = require("./fso-item/fso-item.component");
var FolderStructureComponent = (function () {
    function FolderStructureComponent(folderService) {
        this.folderService = folderService;
        this.test = "testy";
    }
    FolderStructureComponent.prototype.ngOnInit = function () {
        this.getRoot();
    };
    FolderStructureComponent.prototype.getRoot = function () {
        var _this = this;
        this.folderService.getFolderRoot()
            .subscribe(function (root) { return _this.root = root; });
    };
    FolderStructureComponent.prototype.getFiles = function () {
        //this.root.name
    };
    FolderStructureComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'folder-structure',
            templateUrl: 'folder-structure.component.html',
            styleUrls: ['folder-structure.component.css'],
            directives: [fso_item_component_1.FsoItemComponent]
        }), 
        __metadata('design:paramtypes', [folder_service_1.FolderService])
    ], FolderStructureComponent);
    return FolderStructureComponent;
}());
exports.FolderStructureComponent = FolderStructureComponent;
//# sourceMappingURL=folder-structure.component.js.map