import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FolderService } from './folder.service'
import {Fso} from "./fso";
import {FsoItemComponent} from "./fso-item/fso-item.component";
import {FolderStructure} from "./folder-structure";

@Component({
  moduleId: module.id,
  selector: 'folder-structure',
  templateUrl: 'folder-structure.component.html',
  styleUrls: ['folder-structure.component.css'],
  directives: [FsoItemComponent]
})
export class FolderStructureComponent implements OnInit {


  @Input() model:FolderStructure;

  private _filter:string;

  get filter():string {
    return this._filter;
  }

  @Input() set filter(value:string){
    this._filter = value;
    if(this._filter) this.getRoot();
  };

  @Input() setFilter:string;

  @Output() onItemSelected = new EventEmitter<Fso>();
  root:Fso;


  constructor(
    private folderService:FolderService
  ) {


  }

  ngOnInit() {
    this.getRoot();
  }

  getRoot() {
    this.folderService.getFolderRoot(this.filter, this.setFilter)
      .subscribe(root => this.root = root);
  }

  itemSelected(fso:Fso){
    this.onItemSelected.emit(fso);
  }


}
