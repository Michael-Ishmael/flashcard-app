import {Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChange} from '@angular/core';
import {CardCrop, Crop, ImageDimensions, CroppedImage} from "../../shared/crop";
import {CropService} from "../../crop/crop.service";
import {Flashcard} from "../../flashcard/flashcard";
import {CroppedImageComponent} from "../../shared/cropped-image/cropped-image.component";

@Component({
  moduleId: module.id,
  selector: 'crops-preview',
  templateUrl: 'crops-preview.component.html',
  styleUrls: ['crops-preview.component.css'],
  directives: [CroppedImageComponent]
})
export class CropsPreviewComponent implements OnInit, OnChanges {

  @Input() model:Flashcard;
  cardCrops:CardCrop[];
  croppedImages:CroppedImage[];
  cropsLoaded:boolean = false;

  private imageDimensionLookup:{[id:number] : ImageDimensions};


  constructor(
    private cropService: CropService
  ) {
    this.imageDimensionLookup = {};
  }

  ngOnInit() {
    this.loadCropsForCard(this.model.id)
  }

  public ngOnChanges(changes:{[propName:string]:SimpleChange}) {
    if(changes.hasOwnProperty("model")){
      this.loadCropsForCard(this.model.id)
    }
  }


  loadCropsForCard(cardId:number){
    var that = this;
    this.cropsLoaded = false;
    this.cropService.getItems(cardId)
      .subscribe(
        (cardCrops:CardCrop[]) => {
          that.cardCrops = cardCrops;
          that.croppedImages = that.cardCrops.map(c => new CroppedImage(
              this.model.image,
              c.crop,
              400
                        ));
          that.cropsLoaded = true;
        }
      );
  }

  onImageLoaded(dims:ImageDimensions){
    this.imageDimensionLookup[dims.id.toString()] = dims;
  }


  getImagePreviewContainerStyle(cardCrop:CardCrop):any{
    if(!(cardCrop && cardCrop.crop && this.imageDimensionLookup[cardCrop.id.toString()])) return null;
    var crop = cardCrop.crop;
    var imDims = this.imageDimensionLookup[cardCrop.id.toString()];
    var adj = crop.multiply(imDims.width, imDims.height);
    var obj = {'left': adj.x + 'px', 'top': (adj.y + 10) + 'px', 'width': adj.w + 'px', 'height': adj.h + 'px' };
    return obj;
  }

  getImagePreviewStyle(cardCrop:CardCrop):any{
    if(!(cardCrop && cardCrop.crop && this.imageDimensionLookup[cardCrop.id])) return null;
    var crop = cardCrop.crop;
    var imDims = this.imageDimensionLookup[cardCrop.id.toString()];
    var adj = crop.multiply(imDims.width, imDims.height);
    var obj = {'margin-left': '-' + adj.x + 'px', 'margin-top': '-' + adj.y + 'px', 'width':  + imDims.width + 'px', 'height': + imDims.height + 'px' }
    return obj;
  }

}
