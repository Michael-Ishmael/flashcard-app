import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Fso} from "../fso";
import {FolderService} from "../folder.service";

@Component({
  moduleId: module.id,
  selector: 'fso-item',
  templateUrl: 'fso-item.component.html',
  styleUrls: ['fso-item.component.css'],
	directives: [FsoItemComponent],
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

	toRepresentation(){
		if(this.isFile){
			return `${this.model.name} (${this.formatFileSize(this.model.size)})`
		}
	}

	formatFileSize(fileSize:number){
		var kbSize:number = (fileSize > 0 ? Math.round(fileSize / 1000) : 0);
		return `${kbSize}kb`
	}

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

	uploadFile(){
    var that = this;
    this.showLoading = true;
    this.folderService.postMediaFile(this.model)
      .subscribe(f => that.updateUploadedFile(f),
        e => this.showFileApiError(e));
  }

  private updateUploadedFile(returned:Fso){
    this.model.id = returned.id;
    this.model.media_file_type = returned.media_file_type;
    this.showLoading = false;
    this.setFileStatus();
  }


  downloadFile(){
    var that = this;
    this.showLoading = true;
    this.folderService.postFileForPreview(this.model)
      .subscribe(f => that.updateDownloadedFile(f),
       e => this.showFileApiError(e));
  }

  private updateDownloadedFile(returned:Fso){
    this.model.size = returned.size;
    this.model.relativePath = returned.relativePath;
    this.showLoading = false;
    this.setFileStatus();
  }

  private showFileApiError(error:any){
    alert(error);
    this.showLoading = false;
    this.setFileStatus();
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
