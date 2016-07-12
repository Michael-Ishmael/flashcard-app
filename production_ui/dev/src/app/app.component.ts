import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {SettingService} from "./settings/setting.service";

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [
    SettingService
  ]
})
export class AppComponent {
  title = 'app works!';


}




