/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

import { FolderStructureComponent } from './folder-structure.component';

describe('Component: FolderStructure', () => {
  it('should create an instance', () => {
    let component = new FolderStructureComponent();
    expect(component).toBeTruthy();
  });
});
