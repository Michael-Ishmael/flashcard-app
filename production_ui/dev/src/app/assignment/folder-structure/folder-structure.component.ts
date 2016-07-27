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
    this.folderService.getFolderRoot()
      .subscribe(root => this.root = root);
  }

  itemSelected(fso:Fso){
    this.onItemSelected.emit(fso);
  }


}
