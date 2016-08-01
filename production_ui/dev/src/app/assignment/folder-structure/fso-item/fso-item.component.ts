import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Fso} from "../fso";
import {FolderService} from "../folder.service";
import {FsoImgItemComponent} from "./fso-img-item/fso-img-item.component";
import {FsoSoundItemComponent} from "./fso-sound-item/fso-sound-item.component";

@Component({
  moduleId: module.id,
  selector: 'fso-item',
  templateUrl: 'fso-item.component.html',
  styleUrls: ['fso-item.component.css'],
	directives: [FsoItemComponent, FsoImgItemComponent, FsoSoundItemComponent],
})
export class FsoItemComponent implements OnInit {
	@Input() model:Fso;
	@Input() selectMultiple:boolean;
	@Output() onSelected = new EventEmitter<Fso>();
	@Output() onUnSelected = new EventEmitter<Fso>();

	isFolder:boolean;
	isFile:boolean = false;
	notAvailable:boolean = false;
  showIcon:boolean = false;
  showUpload:boolean = false;
  showLoading:boolean = false;

	constructor(
	   private folderService:FolderService
  ){}


	toggleExpanded(){
		this.model.expanded = !this.model.expanded;
	}

	toggleSelected(){
    if(this.notAvailable) return;
		this.model.selected = !this.model.selected;
		if(this.model.selected){
			this.onSelected.emit(this.model);
		} else {
			this.onUnSelected.emit(this.model);
		}
	}


	childSelected(child:Fso){
		this.onSelected.emit(child);
		if(!this.selectMultiple && this.model.files){
			this.model.files.forEach(function(file:Fso){
				if(file != child){
					file.selected = false;
				}
			})
		}
	}

   ngOnInit() {
  	if(this.model.childFolders || this.model.files){
  		this.isFolder = true;
		} else {
			this.isFile = true;
			this.setFileStatus();
		}
  }

  private setFileStatus() {

    if(this.model.size && this.model.size < 100000){
      this.showIcon = true;
      if(!this.model.id){
        this.showUpload = true;
        this.notAvailable = true;
      } else {
        this.showUpload = false;
        this.notAvailable = false;
      }
    } else {
      this.notAvailable = true;
    }

  }


}
