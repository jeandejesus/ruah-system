import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlunosListagemComponent } from './alunos-listagem.component';

describe('AlunosListagemComponent', () => {
  let component: AlunosListagemComponent;
  let fixture: ComponentFixture<AlunosListagemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlunosListagemComponent]
    });
    fixture = TestBed.createComponent(AlunosListagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
