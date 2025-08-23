import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestPage } from './latest-page';

describe('LatestPage', () => {
  let component: LatestPage;
  let fixture: ComponentFixture<LatestPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
