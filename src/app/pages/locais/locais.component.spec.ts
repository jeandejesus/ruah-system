import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocaisComponent } from './locais.component';

describe('LocaisComponent', () => {
  let component: LocaisComponent;
  let fixture: ComponentFixture<LocaisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocaisComponent]
    });
    fixture = TestBed.createComponent(LocaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
