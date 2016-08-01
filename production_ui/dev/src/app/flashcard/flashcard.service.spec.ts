/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { FlashcardService } from './flashcard.service';

describe('Service: FlashcardService', () => {
  beforeEach(() => {
    addProviders([FlashcardService]);
  });

  it('should ...',
    inject([FlashcardService],
      (service: FlashcardService) => {
        expect(service).toBeTruthy();
      }));
});
