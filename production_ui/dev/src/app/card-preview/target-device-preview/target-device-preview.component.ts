import {Component, OnInit, Input} from '@angular/core';
import {TargetDeviceService} from "./target-device.service";
import {TargetDevice, CardTargetDeviceBase, SplitCardTargetDevice} from "./target-device";
import {Flashcard} from "../../flashcard/flashcard";
import {CardTargetDeviceService} from "./card-target-device.service";
import {CombinedXcassetComponent} from "./combined-xcasset/combined-xcasset.component";
import {SplitXcassetComponent, SplitXcassetModel} from "./split-xcasset/split-xcasset.component";

export enum XCassetPreviewView{
  None = 0,
  Combined = 1,
  Split = 2
}

@Component({
  moduleId: module.id,
  selector: 'target-device-preview',
  templateUrl: 'target-device-preview.component.html',
  styleUrls: ['target-device-preview.component.css'],
  directives: [CombinedXcassetComponent, SplitXcassetComponent]
})
export class TargetDevicePreviewComponent implements OnInit {

  @Input() model:Flashcard;
  targetDevices:TargetDevice[];
  selectedDevice:TargetDevice = null;
  xCassetView:XCassetPreviewView = XCassetPreviewView.None;
  currentXCasset:CardTargetDeviceBase;
  splitModel:SplitXcassetModel;

  constructor(
      private deviceService:TargetDeviceService,
      private targetService:CardTargetDeviceService
  ) {
  }

  selectTargetDevice(device:TargetDevice){
    this.selectedDevice = device;
    this.targetService.getItem(this.model.id, device.id)
        .subscribe(
            (xcasset:CardTargetDeviceBase) => {
              this.xCassetView = xcasset.typeId;
              this.currentXCasset = xcasset;
              if(xcasset.typeId == 2){
                this.splitModel = new SplitXcassetModel(xcasset as SplitCardTargetDevice, this.model)
              } else {

              }
            }
        );
  }


  ngOnInit(){
    this.deviceService.getItems(this.model.id)
        .subscribe(
            (targets:TargetDevice[]) => {
              this.targetDevices = targets;
            });
  }

}
