import { Component, OnInit } from '@angular/core';
//import { Router }            from '@angular/router';
import { Setting }                from './setting';
import {SettingService} from "./setting.service";
import {SettingFormComponent} from "./setting-form.component";

@Component({
    selector: 'app-settings',
    templateUrl: 'app/settings/settings.component.html',
    styleUrls:  ['app/settings/settings.component.css'],
    directives: [SettingFormComponent]
})
export class SettingsComponent implements OnInit {
    showAddNew:boolean;
    settings:Setting[];
    errorMessage:any;
    constructor(
        private settingService:SettingService
    ){}

    getSettings(){
        this.settingService.getSettings()
            .subscribe(
                settings => this.settings = settings,
                error => this.errorMessage = <any>error
            );
    }
    
    addNew(){
        this.showAddNew = true;
    }
    
    onSettingUpdated(setting:Setting){
        this.save(setting);
    }
    
    onSettingAdded(setting:Setting){
        this.save(setting, true)
    }

    onSettingDeleted(setting:Setting){
        this.settingService.delete(setting)
            .subscribe(r => this.removeSetting(setting));
    }

    private removeSetting(setting:Setting):void {

        var indexToDelete = -1;
        for (var i = 0; i < this.settings.length; i++) {
            var loopSetting = this.settings[i];
            if(loopSetting.settingKey == setting.settingKey){
                indexToDelete = i;
                break;
            }
        }
        if(indexToDelete > -1){
            this.settings.splice(indexToDelete, 1)
        }

    }


    onAddSettingCancelled(setting:Setting){
        this.showAddNew = false;
    }

    private save(setting:Setting, asNew:boolean=false){
        if(asNew) this.showAddNew =false;
        this.settingService.save(setting, asNew)
            .subscribe(setting =>
                this.settings.push(setting)
            );
    }
    
    

    ngOnInit() {
        this.getSettings();
    }

}