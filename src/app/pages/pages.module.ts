import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ProfessoresComponent } from './professores/professores.component';
import { PagamentosComponent } from './pagamentos/pagamentos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlunosListagemComponent } from './alunos-listagem/alunos-listagem.component';
import { CreateSchoolComponent } from './create-school/create-school.component';
import { PagamentosPixComponent } from './pagamentos-pix/pagamentos-pix.component';
import { CheckoutCartaoComponent } from './checkout-cartao/checkout-cartao.component';

@NgModule({
  declarations: [
    ProfessoresComponent,
    PagamentosComponent,
    AlunosListagemComponent,
    CreateSchoolComponent,
    PagamentosPixComponent,
  ],
  imports: [CommonModule, FormsModule, SharedModule, ReactiveFormsModule],
})
export class PagesModule {}
