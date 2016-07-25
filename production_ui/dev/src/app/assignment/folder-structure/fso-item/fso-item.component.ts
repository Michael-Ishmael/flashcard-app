import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Fso} from "../fso";

@Component({
  moduleId: module.id,
  selector: 'fso-item',
  templateUrl: 'fso-item.component.html',
  styleUrls: ['fso-item.component.css'],
	directives: [FsoItemComponent]
})
export class FsoItemComponent implements OnInit {
  	@Input() model:Fso;
	@Input() selectMultiple:boolean;
	@Output() onSelected = new EventEmitter<Fso>();
	@Output() onUnSelected = new EventEmitter<Fso>();
	isFolder:boolean;
	isFile:boolean;
	showIcon:boolean;

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
			if(this.model.size && this.model.size < 100000){
				this.showIcon = true;
			}
		}
  }

}
