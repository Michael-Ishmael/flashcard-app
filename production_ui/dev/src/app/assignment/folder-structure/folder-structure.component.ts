import { Component, OnInit } from '@angular/core';
import { FolderService } from './folder.service'
import {Fso} from "./fso";
import {FsoItemComponent} from "./fso-item/fso-item.component";

@Component({
  moduleId: module.id,
  selector: 'folder-structure',
  templateUrl: 'folder-structure.component.html',
  styleUrls: ['folder-structure.component.css'],
  directives: [FsoItemComponent]
})
export class FolderStructureComponent implements OnInit {

  test:string = "testy";
  root:Fso;

  constructor(
    private folderService:FolderService
  ) {}

  ngOnInit() {
    this.getRoot();
  }

  getRoot() {
    this.folderService.getFolderRoot()
      .subscribe(root => this.root = root);
  }

  getFiles(){
    //this.root.name
  }

}
