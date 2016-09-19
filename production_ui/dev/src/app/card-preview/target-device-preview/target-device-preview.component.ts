import {Component, OnInit, Input} from '@angular/core';
import {TargetDeviceService} from "./target-device.service";
import {TargetDevice} from "./target-device";
import {Flashcard} from "../../flashcard/flashcard";

@Component({
  moduleId: module.id,
  selector: 'target-device-preview',
  templateUrl: 'target-device-preview.component.html',
  styleUrls: ['target-device-preview.component.css']
})
export class TargetDevicePreviewComponent implements OnInit {

  @Input() model:Flashcard;
  targetDevices:TargetDevice[];
  selectedDevice:TargetDevice = null;

  constructor(
      private service:TargetDeviceService
  ) {
  }

  selectTargetDevice(device:TargetDevice){
    this.selectedDevice = device;
  }


  ngOnInit(){
    this.service.getItems(this.model.id)
        .subscribe(
            (targets:TargetDevice[]) => {
              this.targetDevices = targets;
            });
  }

}
