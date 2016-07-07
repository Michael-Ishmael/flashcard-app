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
var setting_1 = require('./setting');
var SettingFormComponent = (function () {
    function SettingFormComponent() {
        this.onUpdated = new core_1.EventEmitter();
        this.onSettingAdded = new core_1.EventEmitter();
        this.submitted = false;
    }
    SettingFormComponent.prototype.onSubmit = function () {
        this.submitted = true;
        if (this.isNew) {
            this.onSettingAdded.emit(this.model);
        }
        else {
            this.onUpdated.emit(this.model);
        }
    };
    SettingFormComponent.prototype.ngOnInit = function () {
        if (!this.model) {
            this.isNew = true;
            this.model = new setting_1.Setting('', '');
        }
    };
    Object.defineProperty(SettingFormComponent.prototype, "diagnostic", {
        // TODO: Remove this when we're done
        get: function () { return JSON.stringify(this.model); },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(), 
        __metadata('design:type', setting_1.Setting)
    ], SettingFormComponent.prototype, "model", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SettingFormComponent.prototype, "onUpdated", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SettingFormComponent.prototype, "onSettingAdded", void 0);
    SettingFormComponent = __decorate([
        core_1.Component({
            selector: 'setting-form',
            templateUrl: 'app/settings/setting-form.component.html',
            styleUrls: ['app/settings/setting-form.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], SettingFormComponent);
    return SettingFormComponent;
}());
exports.SettingFormComponent = SettingFormComponent;
//# sourceMappingURL=setting-form.component.js.map