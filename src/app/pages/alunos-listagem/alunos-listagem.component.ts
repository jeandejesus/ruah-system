import { Component, OnInit } from '@angular/core';
import { AlunoService } from 'src/app/core/services/aluno.service';
interface Turma {
  name: string;
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
    return aluno.turmas.map((turma: Turma) => turma.name).join(', ');
  }
}
