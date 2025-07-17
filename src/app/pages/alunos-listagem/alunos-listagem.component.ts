import { Component, OnInit } from '@angular/core';
import { AlunoService } from 'src/app/core/services/aluno.service';
interface Turma {
  name: string;
  schedule: string;
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

  constructor(private alunoService: AlunoService) {}

  ngOnInit(): void {
    this.carregarAlunos();
  }

  carregarAlunos(): void {
    this.alunoService.getAlunos().subscribe(
      (response: Aluno[]) => {
        console.log(response);

        this.alunos = response.map((aluno) => ({
          ...aluno,
          turmas: aluno.turmas || [],
        }));
      },
      (error) => {
        console.error('Erro ao carregar alunos:', error);
      }
    );
  }

  getTurmas(aluno: Aluno): string {
    // Implement the logic to get the turmas for the aluno

    console.log(aluno);
    return aluno.turmas
      .map((turma: Turma) => turma.name + ' - ' + turma.schedule)
      .join(', ');
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
