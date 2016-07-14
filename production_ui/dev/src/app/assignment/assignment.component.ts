import { Component, OnInit } from '@angular/core';
import {FolderStructureComponent} from "./folder-structure/folder-structure.component";
import {DeckSetsComponent} from "../deck-sets/deck-sets.component";

@Component({
  moduleId: module.id,
  selector: 'app-assignment',
  templateUrl: 'assignment.component.html',
  styleUrls: ['assignment.component.css'],
  directives: [FolderStructureComponent, DeckSetsComponent]
})
export class AssignmentComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

}
