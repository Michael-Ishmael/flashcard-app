import {IAssignable, AssignableType} from "../shared/assignable";
export class DeckSet implements IAssignable {


    image: string;
    type: AssignableType;
    speech:string;
    completeCount:number;
    incompleteCount:number;

    constructor(
        public id:number,
        public setId:number,
        public name:string,
        public icon:string,
        public displayOrder:number,
        public label:string = null
    ){
      this.image = icon;
      if(!label) this.label = name


    }

  isComplete() :boolean{
    return (this.id > 0 && this.name != null && this.icon != null);
  }


}
