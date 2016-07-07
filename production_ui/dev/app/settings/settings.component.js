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
var setting_service_1 = require("./setting.service");
var setting_form_component_1 = require("./setting-form.component");
var SettingsComponent = (function () {
    function SettingsComponent(settingService) {
        this.settingService = settingService;
    }
    SettingsComponent.prototype.getSettings = function () {
        var _this = this;
        this.settingService.getSettings()
            .subscribe(function (settings) { return _this.settings = settings; }, function (error) { return _this.errorMessage = error; });
    };
    SettingsComponent.prototype.addNew = function () {
        this.showAddNew = true;
    };
    SettingsComponent.prototype.onUpdated = function (setting) {
        this.save(setting);
    };
    SettingsComponent.prototype.onSettingAdded = function (setting) {
        this.save(setting, true);
    };
    SettingsComponent.prototype.save = function (setting, asNew) {
        if (asNew === void 0) { asNew = false; }
        if (asNew)
            this.showAddNew = false;
        this.settingService.save(setting, asNew);
        this.getSettings();
    };
    SettingsComponent.prototype.ngOnInit = function () {
        this.getSettings();
    };
    SettingsComponent = __decorate([
        core_1.Component({
            selector: 'app-settings',
            templateUrl: 'app/settings/settings.component.html',
            styleUrls: ['app/settings/settings.component.css'],
            directives: [setting_form_component_1.SettingFormComponent]
        }), 
        __metadata('design:paramtypes', [setting_service_1.SettingService])
    ], SettingsComponent);
    return SettingsComponent;
}());
exports.SettingsComponent = SettingsComponent;
//# sourceMappingURL=settings.component.js.map