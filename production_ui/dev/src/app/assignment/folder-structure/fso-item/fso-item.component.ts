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
	@Output() onSelected = new EventEmitter<Fso>();
	@Output() onUnSelected = new EventEmitter<Fso>();
	isFolder:boolean;
	isFile:boolean;

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

  ngOnInit() {
  	if(this.model.childFolders || this.model.files){
  		this.isFolder = true;
		} else {
			this.isFile = true;
		}
  }

}
