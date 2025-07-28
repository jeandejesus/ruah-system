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
  turmas: any[] = [];
  locais: any[] = [];
  Novaturma = {
    name: '',
    startTime: '',
    endTime: '',
    local: '',
  };

  editMode = false;
  turmaId: string | null = null;

  constructor(
    private turmaService: TurmaService,
    private localService: LocaisService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarTurmas();
    this.carregarLocais();
  }

  carregarTurmas(): void {
    this.turmaService.getTurmas().subscribe({
      next: (response) => (this.turmas = response),
      error: (error) => console.error('Erro ao carregar as turmas', error),
    });
  }

  carregarLocais(): void {
    this.localService.getLocais().subscribe({
      next: (response) => (this.locais = response),
      error: (error) => console.error('Erro ao carregar os locais', error),
    });
  }

  openModal(turma: any = null): void {
    if (turma?._id) {
      this.editMode = true;
      this.turmaId = turma._id;
      this.Novaturma = {
        name: turma.name || '',
        startTime: turma.startTime || '',
        endTime: turma.endTime || '',
        local: turma.local?._id || '',
      };
    } else {
      this.editMode = false;
      this.Novaturma = {
        name: '',
        startTime: '',
        endTime: '',
        local: '',
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

  onSubmit(): void {
    this.Novaturma.startTime = this.formatarHora(this.Novaturma.startTime);
    this.Novaturma.endTime = this.formatarHora(this.Novaturma.endTime);

    this.editMode ? this.atualizarTurma() : this.criarTurma();
  }

  private formatarHora(hora: string): string {
    return hora.replace(/(\d{2})(\d{2})/, '$1:$2');
  }

  criarTurma(): void {
    this.turmaService.criarTurma(this.Novaturma).subscribe({
      next: (response) => {
        console.log('Turma criada com sucesso!', response);
        this.carregarTurmas();
        this.fecharModal();
      },
      error: (error) => console.error('Erro ao criar a turma', error),
    });
  }

  atualizarTurma(): void {
    if (!this.turmaId) return;

    this.turmaService.atualizarTurma(this.turmaId, this.Novaturma).subscribe({
      next: (response) => {
        console.log('Turma atualizada com sucesso!', response);
        this.carregarTurmas();
        this.fecharModal();
      },
      error: (error) => console.error('Erro ao atualizar a turma', error),
    });
  }

  excluirTurma(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta turma?')) {
      this.turmaService.deletarTurma(id).subscribe({
        next: (response) => {
          console.log('Turma excluída com sucesso!', response);
          this.carregarTurmas();
        },
        error: (error) => console.error('Erro ao excluir a turma', error),
      });
    }
  }

  fecharModal(): void {
    const modalElement = document.getElementById('turmaModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    } else {
      console.error('Modal element not found');
    }
  }
}
