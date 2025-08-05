import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlunoService } from 'src/app/core/services/aluno.service';

// Definição das interfaces para garantir a tipagem correta
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

// Interface para o objeto de resposta da API de paginação
// Assumimos que o serviço retornará uma lista de alunos e o total de registros.
interface PaginationResponse {
  students: Aluno[];
  total: number;
}

@Component({
  selector: 'app-alunos-listagem',
  templateUrl: './alunos-listagem.component.html',
  styleUrls: ['./alunos-listagem.component.scss'],
})
export class AlunosListagemComponent implements OnInit {
  alunos: Aluno[] = [];
  searchText: string = '';
  carregando: boolean = true;

  // Propriedades para controle da paginação
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalAlunos: number = 0;

  constructor(private alunoService: AlunoService, private router: Router) {}

  ngOnInit(): void {
    // Carrega a primeira página ao iniciar o componente
    this.carregarAlunos();
  }

  carregarAlunos(): void {
    this.carregando = true;
    // Chama o serviço com os parâmetros de página e limite
    this.alunoService.getAlunos(this.currentPage, this.itemsPerPage).subscribe(
      (response: any) => {
        this.carregando = false;
        const alunos = response.students || [];
        this.alunos = alunos.map((aluno: any) => ({
          ...aluno,
          turmas: aluno.turmas || [],
        }));
        this.totalAlunos = response.total || 0;
      },
      (error) => {
        console.error('Erro ao carregar alunos:', error);
        this.carregando = false;
      }
    );
  }

  // Método para ir para uma página específica
  irParaPagina(page: number): void {
    if (page > 0 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.carregarAlunos();
    }
  }

  // Método para ir para a próxima página
  proximaPagina(): void {
    this.irParaPagina(this.currentPage + 1);
  }

  // Método para ir para a página anterior
  paginaAnterior(): void {
    this.irParaPagina(this.currentPage - 1);
  }

  // Calcula o número total de páginas
  getTotalPages(): number {
    return Math.ceil(this.totalAlunos / this.itemsPerPage);
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
    // ATENÇÃO: window.confirm() pode não ser visível em alguns ambientes.
    // Considere usar um modal ou snackbar customizado no lugar.
    if (confirm('Tem certeza que deseja deletar este aluno?')) {
      this.alunoService.deleteAluno(id).subscribe(
        () => {
          // Após deletar, recarrega a página para atualizar a lista
          this.carregarAlunos();
        },
        (error) => {
          console.error('Erro ao deletar aluno:', error);
        }
      );
    }
  }
}
