import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessoresComponent } from './professores/professores.component';
import { PagamentosComponent } from './pagamentos/pagamentos.component';
import { FormsModule } from '@angular/forms';
import { AlunosListagemComponent } from './alunos-listagem/alunos-listagem.component';
import { CreateSchoolComponent } from './create-school/create-school.component';
import { PagamentosPixComponent } from './pagamentos-pix/pagamentos-pix.component';

@NgModule({
  declarations: [ProfessoresComponent],
  imports: [CommonModule, FormsModule],
})
export class PagesModule {}
