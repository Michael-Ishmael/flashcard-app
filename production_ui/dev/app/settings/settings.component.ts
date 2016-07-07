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
    
    onUpdated(setting:Setting){
        this.save(setting);
    }
    
    onSettingAdded(setting:Setting){
        this.save(setting, true)
    }

    private save(setting:Setting, asNew:boolean=false){
        if(asNew) this.showAddNew =false;
        this.settingService.save(setting, asNew);
        this.getSettings();
    }

    ngOnInit() {
        this.getSettings();
    }

}