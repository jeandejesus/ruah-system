import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingRuahComponent } from './landing-ruah.component';

describe('LandingRuahComponent', () => {
  let component: LandingRuahComponent;
  let fixture: ComponentFixture<LandingRuahComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LandingRuahComponent]
    });
    fixture = TestBed.createComponent(LandingRuahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
