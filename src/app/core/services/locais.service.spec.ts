import { TestBed } from '@angular/core/testing';

import { LocaisService } from './locais.service';

describe('LocaisService', () => {
  let service: LocaisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocaisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
