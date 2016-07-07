import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import { NgForm }    from '@angular/common';
import { Setting }    from './setting';

@Component({
    selector: 'setting-form',
    templateUrl: 'app/settings/setting-form.component.html',
    styleUrls: ['app/settings/setting-form.component.css']
})
export class SettingFormComponent implements OnInit {
    @Input() model:Setting;
    @Output() onUpdated = new EventEmitter<Setting>();
    @Output() onSettingAdded = new EventEmitter<Setting>();
    isNew:boolean;

    submitted = false;

    onSubmit() { 
        this.submitted = true;
        if(this.isNew){
            this.onSettingAdded.emit(this.model);
        } else {
            this.onUpdated.emit(this.model);
        }
    }

    ngOnInit():any {
        if(!this.model) {
            this.isNew = true;
            this.model = new Setting('', '')
        }
    }

    // TODO: Remove this when we're done
    get diagnostic() { return JSON.stringify(this.model); }
}
