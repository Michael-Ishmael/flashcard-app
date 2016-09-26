import {Component, OnInit, Output, Input, EventEmitter, SimpleChange, OnChanges} from '@angular/core';
import {Flashcard} from "../flashcard/flashcard";
import {ImgCropperComponent} from "./img-cropper/img-cropper.component";
import {Crop, Orientation, AspectRatio, CardCrop} from "../shared/crop";
import {CropService} from "./crop.service";

@Component({
  moduleId: module.id,
  selector: 'crop-component',
  templateUrl: 'crop.component.html',
  styleUrls: ['crop.component.css'],
  directives: [ImgCropperComponent]
})
export class CropComponent implements OnInit, OnChanges {

  @Input() model:Flashcard;
  @Output() onCroppingDone:EventEmitter<number> = new EventEmitter<number>();

  private errorMessage:any;
  currentCrop:CropModel;
  showPreview:boolean;
  doneEnabled:boolean = false;
  private steps:CropStep[];
  private currentStepIndex:number = 0;
  private cropsLoaded:boolean = false;

  constructor(
      private cropService: CropService
  ) {
    this.initSteps();
  }

  private initSteps(){
    this.steps = [
      new CropStep( new AspectRatio(1, 16, 12), Orientation.Landscape),
      new CropStep( new AspectRatio(1, 16, 12), Orientation.Portrait),
      new CropStep( new AspectRatio(2, 16, 9), Orientation.Landscape),
      new CropStep( new AspectRatio(2, 16, 9), Orientation.Portrait),
    ]
  }

  ngOnInit() {
    if(this.model){
      this.initSteps();
      this.loadCropsForCard(this.model.id);
    }
  }

  ngOnChanges(changes:{[propName:string]:SimpleChange}) {
    if(changes.hasOwnProperty("model")){
      this.ngOnInit()
    }
  }

  private moveStep(dir){
    this.currentStepIndex+=dir;
    if(this.currentStepIndex >= this.steps.length) this.currentStepIndex = 0;
    if(this.currentStepIndex < 0) this.currentStepIndex = this.steps.length -1;
    this.loadCurrentStep();
  }

  private loadCurrentStep(){
    var step = this.steps[this.currentStepIndex];
    var cropFoil:Crop = null;
    if(step.orientation == Orientation.Portrait){
      var altStep = this.steps.filter(s => s.aspectRatio.id == step.aspectRatio.id && s.orientation == step.getAltOrientation())[0];
      cropFoil = altStep.getCrop();
    }
    this.currentCrop = new CropModel(step.getAspectRatioFraction(), step.getCrop(), cropFoil);
  }

  croppingDone(){
    if(!this.doneEnabled) {
      this.onCroppingDone.emit(-1);
    }
    if(this.model)
      this.onCroppingDone.emit(this.model.id)
  }

  togglePreview(){
    this.showPreview = !this.showPreview;
  }

  nextCrop() {
    this.moveStep(1);
  }

  previousCrop(){
    this.moveStep(-1);
  }

  allCropsSet():boolean{
    return this.steps.every(s => s.cardCrop && s.cardCrop.id > -1)
  }

  loadCropsForCard(cardId:number){
    var that = this;
    this.cropsLoaded = false;
    this.cropService.getItems(cardId)
      .subscribe(
        (cardCrops:CardCrop[]) => {
          cardCrops.forEach((c:CardCrop) =>
          {
            var matchingStep = that.steps.filter(s => s.aspectRatio.id == c.aspectRatioId && s.orientation == c.orientation)[0];
            matchingStep.cardCrop = c;
          });
          that.currentStepIndex = 0;
          that.cropsLoaded = true;
          that.loadCurrentStep();
        }
      );
  }

  onCropChanged(crop:Crop){
    if(!this.cropsLoaded) return;
    var step = this.steps[this.currentStepIndex];
    if(step.cardCrop == null) {
      step.cardCrop = new CardCrop(-1, this.model.id, step.aspectRatio.id, step.orientation, null);
    }
    if(step.cardCrop.crop == null || !step.cardCrop.crop.equals(crop)){
      step.cardCrop.crop = crop;
      this.saveCurrentCrop();
    }

  }

  saveCurrentCrop() {
    var step = this.steps[this.currentStepIndex];
    if(step.cardCrop != null){
      var cardCrop = step.cardCrop;
      this.cropService.save(cardCrop, cardCrop.id == -1)
          .subscribe(
              (savedCard) => {
                step.cardCrop.id = savedCard.id;
              }
          );
      this.doneEnabled = this.allCropsSet();
      this.loadCurrentStep();
    }
  }

}


export class CropStep{

  public cardCrop:CardCrop;

  constructor(
    public aspectRatio:AspectRatio,
    public orientation:Orientation){

  }

  private calculateDefaultCrop(){
    var r = this.aspectRatio.shortSide / this.aspectRatio.longSide;
    if(this.orientation == Orientation.Landscape){
      return new Crop(0, 0, 1, 1);
    } else {
      return new Crop(0, 0, 1, 1)
    }
  }

  getCrop(){
    if(!this.cardCrop) return this.calculateDefaultCrop();
    return this.cardCrop.crop;
  }

  getAspectRatioFraction():number{
    return this.aspectRatio.getAsFraction(this.orientation);
  }

  getStepKey():string{
    return `${this.aspectRatio.id}_${this.orientation}`;
  }

  getAltStepKey():string{
    var altOrientation = this.getAltOrientation();
    return `${this.aspectRatio.id}_${altOrientation}`;
  }

  getAltOrientation():Orientation{
    if(this.orientation == Orientation.Landscape) return Orientation.Portrait;
    return Orientation.Landscape;
  }

}

export class CropModel{

  constructor(
    public aspectRatioFraction:number,
    public crop:Crop,
    public cropFoil:Crop
  ) {}

}

