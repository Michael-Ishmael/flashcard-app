import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {SettingService} from "./settings/setting.service";
import {FolderService} from "./assignment/folder-structure/folder.service";
import {DeckSetService} from "./deck-sets/deck-set.service";
import {AppSettings} from "./app-settings";
import {FlashcardService} from "./flashcard/flashcard.service";

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [
    SettingService,
    FolderService,
    DeckSetService,
    AppSettings,
      FlashcardService
  ]
})
export class AppComponent {
  title = 'app works!';


}




