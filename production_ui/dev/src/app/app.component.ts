import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {SettingService} from "./settings/setting.service";
import {FolderService} from "./assignment/folder-structure/folder.service";
import {DeckSetService} from "./deck-sets/deck-set.service";
import {AppSettings} from "./app-settings";
import {FlashcardService, FlashcardDetailService} from "./flashcard/flashcard.service";
import {CropService} from "./crop/crop.service";
import {TargetDeviceService} from "./card-preview/target-device-preview/target-device.service";
import {CardTargetDeviceService} from "./card-preview/target-device-preview/card-target-device.service";

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
    FlashcardService,
    FlashcardDetailService,
    CropService,
    TargetDeviceService,
    CardTargetDeviceService
  ]
})
export class AppComponent {
  title = 'app works!';


}




