import { TestBed } from '@angular/core/testing';

import { ComplejosService } from './complejos.service';

describe('ComplejosService', () => {
  let service: ComplejosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplejosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
