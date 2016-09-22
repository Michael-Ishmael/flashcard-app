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
import {DeployCardService, DeploymentResult} from "./deploy-card.service";

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
  deployed:boolean = false;
  deployLabel:string = "Deploy";
  deploying:boolean = false;

  constructor(
      private deviceService:TargetDeviceService,
      private targetService:CardTargetDeviceService,
      private deploymentService:DeployCardService
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

  deployCard(){
    var obs:Observable<DeploymentResult> = null;
    if(this.deployed){
      if(confirm("Are you sure you want to re-deploy images for this card?")){
        obs = this.deploymentService.reDeployCard(this.model.id)
      }
    } else {
      obs = this.deploymentService.deployCard(this.model.id)
    }
    if(obs){
      this.deploying = true;
      obs.subscribe(
        (result:DeploymentResult) => {
          this.deployed = result.deployed;
          this.deployLabel = result.deployed ? "Re-deploy" : "Deploy"
          this.deploying = false;
        },
        (e => this.showDeployError(e))
      );
    }
  }

  private showDeployError(error:any){
    alert(error);
    this.deploying = false;
    this.deployed = false;
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
    this.deploymentService.getDeploymnetStatus(this.model.id)
      .subscribe(
        (result:DeploymentResult) => {
          this.deployed = result.deployed;
          this.deployLabel = result.deployed ? "Re-deploy" : "Deploy"
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
