import {Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import {TargetDeviceService} from "./target-device.service";
import {
  TargetDevice, CardTargetDeviceBase, SplitCardTargetDevice, CombinedCardTargetDevice,
  CardTargetStatus
} from "./target-device";
import {Flashcard} from "../../flashcard/flashcard";
import {CardTargetDeviceService} from "./card-target-device.service";
import {CombinedXcassetComponent, CombinedXcassetModel} from "./combined-xcasset/combined-xcasset.component";
import {SplitXcassetComponent, SplitXcassetModel} from "./split-xcasset/split-xcasset.component";
import {Observable} from "rxjs";

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
export class TargetDevicePreviewComponent implements OnInit, OnChanges {

  @Input() model:Flashcard;
  targetDevices:TargetDevice[];
  selectedDevice:TargetDevice = null;
  xCassetView:XCassetPreviewView = XCassetPreviewView.None;
  currentXCasset:CardTargetDeviceBase;
  splitModel:SplitXcassetModel;
  combinedModel:CombinedXcassetModel;
  statusMessage:string = "";

  constructor(
      private deviceService:TargetDeviceService,
      private targetService:CardTargetDeviceService
  ) {
  }

  ngOnInit(){
    this.deviceService.getItems()
      .subscribe(
        (targets:TargetDevice[]) => {
          this.targetDevices = targets;
          if(targets.length){
            this.selectTargetDevice(targets[0]);
          }
        });
  }

  recalculateTargetCrops(){
    var obs:Observable<CardTargetStatus> = this.xCassetView == XCassetPreviewView.None
      ? this.targetService.createTargetCrops(this.model.id)
      : this.targetService.recalcTargetCrops(this.model.id) ;

    obs.subscribe(
      (result:CardTargetStatus) => {
        if(result.targetsExist){
          if(this.selectedDevice)
            this.getTargetDevice(this.selectedDevice)
        } else {
          this.xCassetView = XCassetPreviewView.None;
          this.statusMessage = result.status;
        }
      }
    );

  }

  public ngOnChanges(changes:{[propName:string]:SimpleChange}) {
    if(changes.hasOwnProperty("model")){
      if(this.selectedDevice) this.reload()
    }
  }

  reload(){
    this.targetService.checkTargetStatus(this.model.id)
      .subscribe(
        (result:CardTargetStatus) => {
          if(result.targetsExist){
            this.getTargetDevice(this.selectedDevice)
          } else {
            this.xCassetView = XCassetPreviewView.None;
            this.statusMessage = result.status;
          }
        }
      );
  }

  selectTargetDevice(device:TargetDevice){
    this.selectedDevice = device;
    this.reload();
  }

  private getTargetDevice(device){
    this.targetService.getItem(this.model.id, device.id)
      .subscribe(
        (xcasset:CardTargetDeviceBase) => {
          this.xCassetView = xcasset.typeId;
          this.currentXCasset = xcasset;
          if(xcasset.typeId == 2){
            this.splitModel = new SplitXcassetModel(xcasset as SplitCardTargetDevice, this.model)
          } else {
            this.combinedModel = new CombinedXcassetModel(xcasset as CombinedCardTargetDevice, this.model)
          }
        }
      );
  }




}
