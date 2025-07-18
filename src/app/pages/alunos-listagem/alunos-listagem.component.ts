import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlunoService } from 'src/app/core/services/aluno.service';
interface Turma {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
}

interface Aluno {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isMinor: boolean;
  turmas: Turma[];
}

@Component({
  selector: 'app-alunos-listagem',
  templateUrl: './alunos-listagem.component.html',
  styleUrls: ['./alunos-listagem.component.scss'],
})
export class AlunosListagemComponent implements OnInit {
  alunos: Aluno[] = [];
  searchText: string = '';

  constructor(private alunoService: AlunoService, private router: Router) {}

  ngOnInit(): void {
    this.carregarAlunos();
  }

  carregarAlunos(): void {
    this.alunoService.getAlunos().subscribe(
      (response: Aluno[]) => {
        this.alunos = response.map((aluno) => ({
          ...aluno,
          turmas: aluno.turmas || [],
        }));

        console.log('Alunos carregados:', this.alunos);
      },
      (error) => {
        console.error('Erro ao carregar alunos:', error);
      }
    );
  }

  getTurmas(aluno: Aluno): string {
    return aluno.turmas
      .map(
        (turma: Turma) =>
          turma.name + ' - ' + turma.startTime + ' às ' + turma.endTime
      )
      .join(', ');
  }

  editar(aluno: Aluno): void {
    const turmasIds = aluno.turmas?.map((t) => t._id) || [];
    this.router.navigate(['/painel/alunos/cadastro'], {
      state: { aluno: { ...aluno, turmas: turmasIds } },
    });
  }

  deletarAluno(id: string): void {
    if (confirm('Tem certeza que deseja deletar este aluno?')) {
      this.alunoService.deleteAluno(id).subscribe(
        () => {
          this.alunos = this.alunos.filter((aluno) => aluno._id !== id);
        },
        (error) => {
          console.error('Erro ao deletar aluno:', error);
        }
      );
    }
  }
}
