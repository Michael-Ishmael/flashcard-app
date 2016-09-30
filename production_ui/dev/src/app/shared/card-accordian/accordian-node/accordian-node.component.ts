import {Component, OnInit, Input} from '@angular/core';
import {AccordianNode} from "../card-accordian";

@Component({
  moduleId: module.id,
  selector: 'accordian-node',
  templateUrl: 'accordian-node.component.html',
  styleUrls: ['accordian-node.component.css']
})
export class AccordianNodeComponent implements OnInit {

  @Input() model:AccordianNode;

  constructor() { }

  ngOnInit() {
  }

}
