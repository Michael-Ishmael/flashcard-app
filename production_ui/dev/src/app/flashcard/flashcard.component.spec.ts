/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { addProviders, async, inject } from '@angular/core/testing';
import { FlashcardComponent } from './flashcard.component';

describe('Component: Flashcard', () => {
  it('should create an instance', () => {
    let component = new FlashcardComponent(null);
    expect(component).toBeTruthy();
  });
});
