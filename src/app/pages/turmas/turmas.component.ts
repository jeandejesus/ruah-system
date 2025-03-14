import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TurmaService } from 'src/app/core/services/turma.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-turmas',
  templateUrl: './turmas.component.html',
  styleUrls: ['./turmas.component.scss'],
})
export class TurmasComponent implements OnInit {
  turmas: any[] = []; // Lista de turmas existentes
  novaTurma = {
    name: '',
    duration: 0,
    schedule: '',
    location: '',
  };

  editMode = false; // Define se estamos em modo de edição
  turmaId: string | null = null; // Para armazenar o ID da turma, caso seja edição

  constructor(private turmaService: TurmaService, private router: Router) {}

  ngOnInit(): void {
    this.carregarTurmas(); // Carregar as turmas existentes
  }

  // Método para carregar todas as turmas
  carregarTurmas(): void {
    this.turmaService.getTurmas().subscribe(
      (response) => {
        this.turmas = response;
      },
      (error) => {
        console.error('Erro ao carregar as turmas', error);
      }
    );
  }

  openModal() {
    const modalElement = document.getElementById('turmaModal');

    // Verifique se o modalElement não é null antes de usá-lo
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Modal element not found');
    }
  }

  // Método para enviar o formulário (criar ou editar)
  onSubmit(): void {
    if (this.editMode && this.turmaId) {
      this.atualizarTurma();
    } else {
      this.criarTurma();
    }
  }

  // Método para criar a turma
  criarTurma(): void {
    this.turmaService.criarTurma(this.novaTurma).subscribe(
      (response) => {
        console.log('Turma criada com sucesso!', response);
        this.carregarTurmas(); // Recarregar lista de turmas
        this.fecharModal();
      },
      (error) => {
        console.error('Erro ao criar a turma', error);
      }
    );
  }

  // Método para atualizar a turma
  atualizarTurma(): void {
    if (this.turmaId) {
      this.turmaService.atualizarTurma(this.turmaId, this.novaTurma).subscribe(
        (response) => {
          console.log('Turma atualizada com sucesso!', response);
          this.carregarTurmas(); // Recarregar lista de turmas
          this.fecharModal();
        },
        (error) => {
          console.error('Erro ao atualizar a turma', error);
        }
      );
    }
  }

  // Método para fechar o modal
  fecharModal(): void {
    const modalElement = document.getElementById('turmaModal');

    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement); // Pega a instância do modal
      if (modal) {
        modal.hide(); // Fecha o modal
      } else {
        console.error('Modal instance not found');
      }
    } else {
      console.error('Modal element not found');
    }
  }
}
