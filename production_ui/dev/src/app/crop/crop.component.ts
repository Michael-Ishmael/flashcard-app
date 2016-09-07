import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {FlashcardDetail, CropImage} from "../flashcard/flashcard";
import {FlashcardDetailService} from "../flashcard/flashcard.service";
import {ImgCropperComponent} from "./img-cropper/img-cropper.component";
import {Crop, Orientation, AspectRatio, CardCrop} from "./crop";
import {CropService} from "./crop.service";

@Component({
  moduleId: module.id,
  selector: 'app-crop',
  templateUrl: 'crop.component.html',
  styleUrls: ['crop.component.css'],
  directives: [ImgCropperComponent]
})
export class CropComponent implements OnInit {

  private sub:Subscription;
  model:FlashcardDetail;
  private errorMessage:any;
  currentCrop:CropModel;
  showPreview:boolean;
  private steps:CropStep[];
  private currentStepIndex:number = 0;


  constructor(
      private route: ActivatedRoute,
      private service: FlashcardDetailService,
      private cropService: CropService

  ) {
    this.steps = [
      new CropStep( new AspectRatio(1, 16, 12), Orientation.Landscape),
      new CropStep( new AspectRatio(1, 16, 12), Orientation.Portrait),
      new CropStep( new AspectRatio(2, 16, 9), Orientation.Landscape),
      new CropStep( new AspectRatio(2, 16, 9), Orientation.Portrait),
    ]
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

  togglePreview(){
    this.showPreview = !this.showPreview;
  }

  nextCrop() {
    this.moveStep(1);
  }

  previousCrop(){
    this.moveStep(-1);
  }

  ngOnInit() {
    var that = this;
    this.sub = this.route.params.subscribe(params => {
      let id = +params['id']; // (+) converts string 'id' to a number
      this.service.getItem(id)
          .subscribe(
              item => {
                that.model = item;
                that.loadCropsForCard(item.id);
              },
              error => this.errorMessage = <any>error
          )
    });
  }

  loadCropsForCard(cardId:number){
    var that = this;
    this.cropService.getItems(cardId)
      .subscribe(
        (cardCrops:CardCrop[]) => {
          cardCrops.forEach((c:CardCrop) =>
          {
            var matchingStep = that.steps.filter(s => s.aspectRatio.id == c.aspectRatioId && s.orientation == c.orientation)[0];
            matchingStep.cardCrop = c;
          });
          that.currentStepIndex = 0;
          that.loadCurrentStep();
        }
      );
  }

  onCropChanged(crop:Crop){
    var step = this.steps[this.currentStepIndex];
    if(step.cardCrop == null) {
      step.cardCrop = new CardCrop(-1, this.model.id, step.aspectRatio.id, step.orientation, null);
    }
    var cardCrop = step.cardCrop;
    cardCrop.crop = crop;
    this.cropService.save(cardCrop, cardCrop.id == -1)
      .subscribe(
        (savedCard) => {
          step.cardCrop.id = savedCard.id;
        }
      );
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
      return new Crop(.25, .25 * r, .5, .5 * r);
    } else {
      return new Crop(.25 * r, .25, .5 * r, .5)
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

export class ImageDimensions{

  constructor(
    public width:Number,
    public height:Number
  ){

  }
}