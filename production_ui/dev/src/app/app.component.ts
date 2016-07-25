import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {SettingService} from "./settings/setting.service";
import {FolderService} from "./assignment/folder-structure/folder.service";
import {DeckSetService} from "./deck-sets/deck-set.service";
import {FsoItemComponent} from "./assignment/folder-structure/fso-item/fso-item.component";

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [
    SettingService,
    FolderService,
    DeckSetService
  ]
})
export class AppComponent {
  title = 'app works!';


}




