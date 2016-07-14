/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

import { DeckSetsComponent } from './deck-sets.component';

describe('Component: DeckSets', () => {
  it('should create an instance', () => {
    let component = new DeckSetsComponent(null);
    expect(component).toBeTruthy();
  });
});
