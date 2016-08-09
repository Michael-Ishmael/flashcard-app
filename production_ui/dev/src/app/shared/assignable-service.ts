
import {Subject, Observable} from "rxjs/Rx";
import {IAssignable} from "./assignable";

export abstract class AssignableService<T extends IAssignable>  {

  protected itemEditedSource = new Subject<T>();
  itemEdited$ = this.itemEditedSource.asObservable();

  abstract getItems(filterId:number): Observable<T[]>;

  abstract delete(item:T);

  abstract save(selectedItem:T, creating:boolean)

  abstract announceItemEdited(item:T) ;
}