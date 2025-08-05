import { Component, OnInit } from '@angular/core';
import { AlunoService } from 'src/app/core/services/aluno.service';

@Component({
  selector: 'app-pagamentos-pix',
  templateUrl: './pagamentos-pix.component.html',
  styleUrls: ['./pagamentos-pix.component.scss'],
})
export class PagamentosPixComponent implements OnInit {
  alunos: any[] = [];
  mesAtual: string = '';
  carregando = true;

  constructor(private alunosPixService: AlunoService) {}

  ngOnInit() {
    this.carregando = true;
    const hoje = new Date();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    this.mesAtual = `${ano}-${mes}`;

    this.alunosPixService.getAlunosPix().subscribe((res) => {
      this.alunos = res;
      this.carregando = false;
    });
  }

  isPago(aluno: any): boolean {
    return aluno.payments?.some(
      (p: any) => p.month === this.mesAtual && p.paid
    );
  }

  marcarComoPago(alunoId: string) {
    this.alunosPixService
      .marcarPagamento(alunoId, this.mesAtual)
      .subscribe(() => {
        const aluno = this.alunos.find((a) => a._id === alunoId);
        if (aluno) {
          const index = aluno.payments.findIndex(
            (p: any) => p.month === this.mesAtual
          );
          if (index >= 0) {
            aluno.payments[index].paid = true;
          } else {
            aluno.payments.push({ month: this.mesAtual, paid: true });
          }
        }
      });
  }
}
