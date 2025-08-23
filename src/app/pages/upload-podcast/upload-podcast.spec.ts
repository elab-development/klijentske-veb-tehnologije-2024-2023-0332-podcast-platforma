import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPodcast } from './upload-podcast';

describe('UploadPodcast', () => {
  let component: UploadPodcast;
  let fixture: ComponentFixture<UploadPodcast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadPodcast]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadPodcast);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
