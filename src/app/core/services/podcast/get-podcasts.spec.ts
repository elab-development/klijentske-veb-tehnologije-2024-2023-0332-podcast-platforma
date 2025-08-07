import { TestBed } from '@angular/core/testing';

import { GetPodcasts } from './get-podcasts';

describe('GetPodcasts', () => {
  let service: GetPodcasts;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetPodcasts);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
