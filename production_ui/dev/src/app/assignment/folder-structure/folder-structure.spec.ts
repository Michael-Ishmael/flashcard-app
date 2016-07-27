/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import {FolderStructure} from './folder-structure';

describe('FolderStructure', () => {
  it('should create an instance', () => {
    expect(new FolderStructure(null, false, false)).toBeTruthy();
  });
});
