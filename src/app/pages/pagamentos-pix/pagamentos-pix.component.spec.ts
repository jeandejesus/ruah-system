import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagamentosPixComponent } from './pagamentos-pix.component';

describe('PagamentosPixComponent', () => {
  let component: PagamentosPixComponent;
  let fixture: ComponentFixture<PagamentosPixComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PagamentosPixComponent]
    });
    fixture = TestBed.createComponent(PagamentosPixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
