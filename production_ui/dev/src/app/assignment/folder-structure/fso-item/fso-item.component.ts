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
	@Output() onChecked = new EventEmitter<Fso>();
	@Output() onUnchecked = new EventEmitter<Fso>();
	isFolder:boolean;
	isFile:boolean;

  ngOnInit() {
  	if(this.model.childFolders || this.model.files){
  		this.isFolder = true;
		} else {
			this.isFile = true;
		}
  }

}
