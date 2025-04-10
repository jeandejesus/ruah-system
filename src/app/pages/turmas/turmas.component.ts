import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TurmaService } from 'src/app/core/services/turma.service';
import * as bootstrap from 'bootstrap';
import { LocaisService } from 'src/app/core/services/locais.service';

@Component({
  selector: 'app-turmas',
  templateUrl: './turmas.component.html',
  styleUrls: ['./turmas.component.scss'],
})
export class TurmasComponent implements OnInit {
  turmas: any[] = []; // Lista de turmas existentes
  locais: any[] = []; // Lista de locais
  Novaturma = {
    name: '',
    duration: 0,
    startTime: '',
    endTime: '',
    local: '', // ID do local selecionado
  };

  editMode = false; // Define se estamos em modo de edição
  turmaId: string | null = null; // Para armazenar o ID da turma, caso seja edição

  constructor(
    private turmaService: TurmaService,
    private localService: LocaisService, // Injetando o serviço de Local
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarTurmas(); // Carregar as turmas existentes
    this.carregarLocais(); // Carregar os locais cadastrados
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

  // Método para carregar todos os locais
  carregarLocais(): void {
    this.localService.getLocais().subscribe(
      (response) => {
        this.locais = response;
      },
      (error) => {
        console.error('Erro ao carregar os locais', error);
      }
    );
  }

  openModal(turma: any = {}) {
    if (turma._id) {
      this.editMode = true;
      this.turmaId = turma._id;
      this.Novaturma = { ...turma }; // Usando spread operator para não mutar a referência
      this.Novaturma.local = turma.local?._id; // Setando o ID do local
    } else {
      this.editMode = false;
      this.Novaturma = {
        name: '',
        duration: 0,
        startTime: '',
        endTime: '',
        local: '', // ID do local selecionado
      };
    }

    const modalElement = document.getElementById('turmaModal');

    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Modal element not found');
    }
  }

  // Método para enviar o formulário (criar ou editar)
  onSubmit(): void {
    // Formatando os horários para o formato HH:MM
    this.Novaturma.startTime = this.Novaturma.startTime.replace(/(\d{2})(\d{2})/, '$1:$2');
    this.Novaturma.endTime = this.Novaturma.endTime.replace(/(\d{2})(\d{2})/, '$1:$2');

    if (this.turmaId) {
      this.atualizarTurma();
    } else {
      this.criarTurma();
    }
  }

  // Método para criar a turma
  criarTurma(): void {
    this.turmaService.criarTurma(this.Novaturma).subscribe(
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
      this.turmaService.atualizarTurma(this.turmaId, this.Novaturma).subscribe(
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

  // Método para excluir a turma
  excluirTurma(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta turma?')) {
      this.turmaService.deletarTurma(id).subscribe(
        (response) => {
          console.log('Turma excluída com sucesso!', response);
          this.carregarTurmas(); // Recarregar lista de turmas
        },
        (error) => {
          console.error('Erro ao excluir a turma', error);
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
