import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlunosComponent } from './alunos/alunos.component';
import { ProfessoresComponent } from './professores/professores.component';
import { PagamentosComponent } from './pagamentos/pagamentos.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AlunosComponent, ProfessoresComponent, PagamentosComponent],
  imports: [CommonModule, FormsModule],
})
export class PagesModule {}
