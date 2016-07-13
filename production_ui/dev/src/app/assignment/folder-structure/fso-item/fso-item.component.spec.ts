/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

import { FsoItemComponent } from './fso-item.component';

describe('Component: FsoItem', () => {
  it('should create an instance', () => {
    let component = new FsoItemComponent();
    expect(component).toBeTruthy();
  });
});
