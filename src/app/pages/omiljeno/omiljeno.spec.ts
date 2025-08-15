import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Omiljeno } from './omiljeno';

describe('Omiljeno', () => {
  let component: Omiljeno;
  let fixture: ComponentFixture<Omiljeno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Omiljeno]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Omiljeno);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
