import { Component, OnInit } from '@angular/core';
import { AlunoService } from 'src/app/core/services/aluno.service';
import { TurmaService } from 'src/app/core/services/turma.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aluno',
  templateUrl: './alunos.component.html',
  styleUrls: ['./alunos.component.scss'],
})
export class AlunosComponent implements OnInit {
  aluno: any = this.getEmptyAluno();
  isLoading = false;
  editMode: boolean = false;
  turmas: any[] = [];

  constructor(
    private alunosService: AlunoService,
    private turmaService: TurmaService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const aluno = history.state.aluno;
    if (aluno) {
      this.editMode = true;
      this.aluno = { ...aluno };
      if (typeof this.aluno.birthDate === 'string') {
        const match = this.aluno.birthDate.match(/^\d{4}-\d{2}-\d{2}/);
        if (match) {
          const [year, month, day] = match[0].split('-');
          this.aluno.birthDate = `${day}/${month}/${year}`;
        }
      }
    }

    this.turmaService.getTurmas().subscribe((turmas) => {
      this.turmas = turmas;
    });
  }

  openModal() {
    this.editMode = false;
    this.aluno = this.getEmptyAluno();
    const modalElement = document.getElementById('alunoModal');
    if (modalElement) {
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Modal element not found');
    }
  }

  onSubmit() {
    const alunoCopy = { ...this.aluno };
    console.log(alunoCopy);
    this.formatDate(alunoCopy);
    if (this.editMode) {
      this.updateAluno(alunoCopy);
    } else {
      this.createAluno(alunoCopy);
    }
  }

  private formatDate(aluno: any) {
    const str = aluno.birthDate;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
      const [day, month, year] = str.split('/');
      aluno.birthDate = `${year}-${month}-${day}`;
    } else if (/^\d{8}$/.test(str)) {
      aluno.birthDate = `${str.slice(4)}-${str.slice(2, 4)}-${str.slice(0, 2)}`;
    }
  }

  createAluno(aluno: any) {
    this.alunosService.createAluno(aluno).subscribe(
      () => {
        this.toastr.success('Operação realizada com sucesso!', 'Sucesso');
        this.resetForm();
      },
      (error) => {
        this.toastr.error(error.error?.message || 'Erro ao criar aluno');
      }
    );
  }

  updateAluno(aluno: any) {
    console.log('Atualizando aluno:', aluno);
    this.alunosService.updateAluno(aluno).subscribe(
      () => {
        this.toastr.success('Atualizado com sucesso!', 'Sucesso');
        this.resetForm();
      },
      (error) => {
        this.toastr.error(error.error?.message || 'Erro ao atualizar aluno');
      }
    );
  }

  resetHistoryState() {
    history.replaceState({}, '');
  }

  resetForm() {
    this.aluno = this.getEmptyAluno();
    this.editMode = false;
    this.resetHistoryState();
  }

  editAluno(aluno: any) {
    this.editMode = true;
    this.aluno = { ...aluno };
    if (typeof this.aluno.birthDate === 'string') {
      const match = this.aluno.birthDate.match(/^\d{4}-\d{2}-\d{2}/);
      if (match) {
        const [year, month, day] = match[0].split('-');
        this.aluno.birthDate = `${day}/${month}/${year}`;
      }
    }

    const modalElement = document.getElementById('alunoModal');
    if (modalElement) {
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Modal element not found');
    }
  }

  getEmptyAluno() {
    return {
      name: '',
      cpf: '',
      rg: '',
      birthDate: '',
      phone: '',
      email: '',
      address: '',
      emergencyContact: { name: '', phone: '' },
      responsible: { name: '', cpf: '', rg: '', phone: '' },
      isMinor: false,
      isPix: false,
      turmas: [],
      monthlyFee: '',
      billingDay: 10,
    };
  }

  formatMonthlyFee(value: string) {
    if (value === null || value === undefined || value === '') {
      this.aluno.monthlyFee = '';
      return;
    }

    // Remove tudo que não seja número (incluindo vírgulas e pontos)
    const numericValue = value.replace(/\D/g, '');

    // Converte para um número e divide por 100 para ter as casas decimais
    const floatValue = parseFloat(numericValue) / 100;

    // Formata o número para o padrão de moeda brasileiro
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(floatValue);

    this.aluno.monthlyFee = formattedValue.toString();
  }
}
