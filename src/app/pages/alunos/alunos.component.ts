import { Component, OnInit } from '@angular/core';
import { AlunoService } from 'src/app/core/services/aluno.service';
import { TurmaService } from 'src/app/core/services/turma.service';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-aluno',
  templateUrl: './alunos.component.html',
  styleUrls: ['./alunos.component.scss'],
})
export class AlunosComponent implements OnInit {
  // Aluno objeto com as propriedades necessárias
  aluno: any = {
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
    turmas: [], // Múltiplas turmas podem ser selecionadas
  };
  isLoading = false;

  // Para controle de edição e criação
  editMode: boolean = false;

  // Lista de turmas - Aqui você deve preencher com os dados reais
  turmas: any[] = [];

  constructor(
    private alunosService: AlunoService,
    private turmaService: TurmaService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.turmaService.getTurmas().subscribe((turmas) => {
      this.turmas = turmas;
    });
    this.aluno.turmas = [];
  }

  // Função para abrir o modal (muda o estado de edição)
  openModal() {
    this.editMode = false; // Quando abrir para adicionar um novo aluno
    this.aluno = {
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
      turmas: [], // Limpa as turmas ao abrir para criação
    };
    const modalElement = document.getElementById('alunoModal');
    if (modalElement) {
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Modal element not found');
    }
  }

  // Função para enviar o formulário (criação ou atualização de aluno)
  onSubmit() {
    this.aluno.birthDate = format(new Date(this.aluno.birthDate), 'yyyy-MM-dd');

    if (this.editMode) {
      this.updateAluno();
    } else {
      this.createAluno();
    }
  }

  // Função para criar um novo aluno
  createAluno() {
    // Chama a service para criar o aluno
    this.alunosService.createAluno(this.aluno).subscribe(
      async (response) => {
        this.toastr.success('Operação realizada com sucesso!', 'Sucesso');

        this.resetForm();
      },
      async (error) => {
        this.toastr.error('Ocorreu um erro. Tente novamente.', 'Erro');

        console.error('Erro ao cadastrar aluno:', error);
      }
    );
  }

  // Função para editar um aluno (ativada se editMode for verdadeiro)
  updateAluno() {
    // Chama a service para atualizar o aluno
    this.alunosService.updateAluno(this.aluno).subscribe(
      (response) => {
        console.log('Aluno atualizado com sucesso:', response);
        this.resetForm();
      },
      (error) => {
        console.error('Erro ao atualizar aluno:', error);
      }
    );
  }

  // Função para limpar o formulário após a criação ou atualização
  resetForm() {
    this.aluno = {
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
      turmas: [], // Limpa as turmas selecionadas
    };
    this.editMode = false;
  }

  // Função para editar um aluno existente (passando dados para o modal)
  editAluno(aluno: any) {
    this.editMode = true;
    this.aluno = { ...aluno }; // Preenche os campos com os dados do aluno

    // Garantir que as turmas selecionadas no aluno sejam refletidas no campo de seleção
    const modalElement = document.getElementById('alunoModal');
    if (modalElement) {
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Modal element not found');
    }
  }
}
