import {IAssignable, AssignableType} from "../shared/assignable";
export class DeckSet implements IAssignable {

    image: string;
    type: AssignableType;

    constructor(
        public id:number,
        public setId:number,
        public name:string,
        public icon:string,
        public displayOrder:number
    ){
      this.image = icon;
    }
}
