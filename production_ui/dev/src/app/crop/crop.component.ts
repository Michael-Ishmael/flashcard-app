import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {FlashcardDetail, CropImage} from "../flashcard/flashcard";
import {FlashcardDetailService} from "../flashcard/flashcard.service";
import {ImgCropperComponent} from "./img-cropper/img-cropper.component";
import {Crop} from "./crop";

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
  currentCrop:Crop;


  constructor(
      private route: ActivatedRoute,
      private service: FlashcardDetailService
  ) {

  }


  ngOnInit() {
    var that = this;
    this.sub = this.route.params.subscribe(params => {
      let id = +params['id']; // (+) converts string 'id' to a number
      this.service.getItem(id)
          .subscribe(
              item => {
                that.model = item;
                that.currentCrop = new Crop(.25, .25, .75, .75);
              },
              error => this.errorMessage = <any>error
          )
    });
  }

  // loadImage() {
  //   this.cropImage = new CropImage();
  //   this.cropImage.image = this.model.image;
  // }

}
