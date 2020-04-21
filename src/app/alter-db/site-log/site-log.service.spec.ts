import { TestBed } from '@angular/core/testing';

import { SiteLogService } from './site-log.service';

describe('SiteLogService', () => {
  let service: SiteLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
