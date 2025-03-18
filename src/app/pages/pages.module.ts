import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessoresComponent } from './professores/professores.component';
import { PagamentosComponent } from './pagamentos/pagamentos.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProfessoresComponent, PagamentosComponent],
  imports: [CommonModule, FormsModule],
})
export class PagesModule {}
