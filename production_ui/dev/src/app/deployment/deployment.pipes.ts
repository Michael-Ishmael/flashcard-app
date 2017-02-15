
import {Pipe} from '@angular/core';
import {Flashcard} from "../flashcard/flashcard";


// Tell Angular2 we're creating a Pipe with TypeScript decorators
@Pipe({
  name: 'CardStatusPipe'
})
export class CardStatusPipe {

  transform(value:Array<Flashcard>, status:Number) {

    return value.filter((card:Flashcard) => {
      return card.status == status;
    });
  }

}