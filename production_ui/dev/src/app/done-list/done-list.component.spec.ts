/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { addProviders, async, inject } from '@angular/core/testing';
import { DoneListComponent } from './done-list.component';

describe('Component: DoneList', () => {
  it('should create an instance', () => {
    let component = new DoneListComponent();
    expect(component).toBeTruthy();
  });
});
