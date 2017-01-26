import {SimpleChange, EventEmitter, Output, Input} from "@angular/core";
import {IAssignable} from "./assignable";
import {AssignableService} from "./assignable-service";
export abstract class AssignableComponent<T extends IAssignable> {


  @Input() filterId:number = 1;
  @Output() onItemSelected = new EventEmitter<T>();
  @Output() onItemEditing = new EventEmitter<T>();

  items:T[];
  errorMessage:any;

  selectedItem:T;
  editing:boolean;
  creating:boolean;

  constructor(
      private assignableService:AssignableService<T>
  ) { }

  getItems(){
    if(this.filterId == 0){
      this.items = [];
      return;
    }
    this.assignableService.getItems(this.filterId)
        .subscribe(
            items => this.items = items,
            error => this.errorMessage = <any>error
        )
  }

  selectItem(item:T){
    this.selectedItem = item;
    this.onItemSelected.emit(item)
  }


  addNewItem(){
    if(this.creating) return;
    this.selectedItem = this.createItem();
    this.creating = true;
    this.editing =true;
    this.items.unshift(this.selectedItem);
    this.onItemEditing.emit(this.selectedItem)
  }

  abstract createItem():T



  deleteItem(item:T){
    this.assignableService.delete(item)
        .subscribe(r => this.removeItem(item));

  }


  private removeItem(item:T):void {

    var indexToDelete = -1;
    for (var i = 0; i < this.items.length; i++) {
      var loopSetting = this.items[i];
      if(loopSetting.id == item.id){
        indexToDelete = i;
        break;
      }
    }
    if(indexToDelete > -1){
      this.items.splice(indexToDelete, 1)
    }

  }

  cancelEdit(){
    this.editing = false;
    if(this.creating){
      this.items.shift();
      this.creating = false;
      this.selectedItem = null;
    }
  }

  editItem(item:T){
    if(this.selectedItem !== item){
      this.selectItem(item)
    }
    this.editing = true;
    this.assignableService.announceItemEdited(item);
    this.onItemEditing.emit(item);
  }

  saveItem(item:T){
    if(item){
      this.assignableService.save(this.selectedItem, this.creating)
          .subscribe(s => this.saveIfNew(s, this))
    }
  }

  private saveIfNew(savedItem:T, comp:AssignableComponent<T>){
    if(comp.creating){
      this.removeItem(comp.selectedItem);
      this.items.push(savedItem);
      this.onItemSelected.emit(savedItem);
      comp.creating = false;
    }
    comp.editing = false;
  }

  ngOnInit() {
    this.getItems();
    this.assignableService.itemEdited$.subscribe(ds => {
      if(this.editing && this.selectedItem != ds){
        this.cancelEdit();
      }
    });
  }

  ngOnChanges(changes:{[propName:string]:SimpleChange}) {
    if(changes.hasOwnProperty("filterId")){
      this.getItems()
    }
  }

}