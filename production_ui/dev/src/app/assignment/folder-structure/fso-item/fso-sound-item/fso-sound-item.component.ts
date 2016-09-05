import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Fso} from "../../fso";
import {FolderService} from "../../folder.service";


@Component({
  moduleId: module.id,
  selector: 'fso-sound-item',
  templateUrl: 'fso-sound-item.component.html',
  styleUrls: ['fso-sound-item.component.css']
})
export class FsoSoundItemComponent implements OnInit {


  @Input() model:Fso;
  @Input() selectMultiple:boolean;
  @Output() onSelected = new EventEmitter<Fso>();
  @Output() onUnSelected = new EventEmitter<Fso>();

  notAvailable:boolean = false;
  showIcon:boolean = false;
  showUpload:boolean = false;
  showLoading:boolean = false;
  playing:boolean = false;
  audio:HTMLAudioElement = null;

  constructor(private folderService:FolderService) { }

  ngOnInit() {
    this.setFileStatus();
  }

  toRepresentation(){
    return `${this.model.name} (${this.formatFileSize(this.model.size)})`
  }

  formatFileSize(fileSize:number){
    var kbSize:number = (fileSize > 0 ? Math.round(fileSize / 1000) : 0);
    return `${kbSize}kb`
  }

  togglePlaySound(){
    if(!this.audio){
      this.audio = new Audio();
      this.audio.src =  this.model.relativePath;
      var that = this;
      this.audio.addEventListener("ended", function(){
        that.audio.currentTime = 0;
        that.playing = false;
      });
      this.audio.load();
    }
    if(this.playing){
      this.playing =false;
      this.audio.pause()
      this.audio.currentTime = 0;
    } else {
      this.playing = true;
      this.audio.play();
    }
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

}
