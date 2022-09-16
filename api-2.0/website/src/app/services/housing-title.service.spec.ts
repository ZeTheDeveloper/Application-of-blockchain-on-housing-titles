import { TestBed } from '@angular/core/testing';

import { HousingTitleService } from './housing-title.service';

describe('HousingTitleService', () => {
  let service: HousingTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HousingTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
