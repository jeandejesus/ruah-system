import { Component, OnInit } from '@angular/core';
import { AlunoService } from 'src/app/core/services/aluno.service';
import { TurmaService } from 'src/app/core/services/turma.service';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

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
    birthDate: Date,
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
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const aluno = history.state.aluno;

    if (aluno) {
      this.editMode = true;
      this.aluno = aluno;
      let dateStr = this.aluno.birthDate;

      if (dateStr && typeof dateStr === 'string') {
        // Se vier no formato ISO (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss)
        const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (match) {
          this.aluno.birthDate = `${match[3]}/${match[2]}/${match[1]}`;
        }
        // Se já estiver no formato DD/MM/YYYY, não faz nada
      }
    } else {
      this.aluno.turmas = [];
    }
    this.turmaService.getTurmas().subscribe((turmas) => {
      this.turmas = turmas;
    });
  }

  // Função para abrir o modal (muda o estado de edição)
  openModal() {
    this.editMode = false; // Quando abrir para adicionar um novo aluno
    this.aluno = {
      name: '',
      cpf: '',
      rg: '',
      birthDate: Date,
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
    // Aceita tanto DD/MM/YYYY quanto DDMMYYYY
    let birthDateString = this.aluno.birthDate;

    // Se vier no formato DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(birthDateString)) {
      const [day, month, year] = birthDateString.split('/');
      this.aluno.birthDate = `${year}-${month}-${day}`;
    }
    // Se vier no formato DDMMYYYY
    else if (/^\d{8}$/.test(birthDateString)) {
      this.aluno.birthDate = `${birthDateString.slice(
        4,
        8
      )}-${birthDateString.slice(2, 4)}-${birthDateString.slice(0, 2)}`;
    }

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
      async (er) => {
        console.error('Erro ao criar aluno:', er);
        this.toastr.error(er.error.message);
      }
    );
  }

  // Função para editar um aluno (ativada se editMode for verdadeiro)
  updateAluno() {
    // Chama a service para atualizar o aluno
    this.alunosService.updateAluno(this.aluno).subscribe(
      () => {
        this.resetForm();
      },
      (error) => {
        console.error('Erro ao atualizar aluno:', error);
      }
    );
  }
  resetHistoryState() {
    history.replaceState({}, '');
  }
  // Função para limpar o formulário após a criação ou atualização
  resetForm() {
    this.aluno = {
      name: '',
      cpf: '',
      rg: '',
      birthDate: Date,
      phone: '',
      email: '',
      address: '',
      emergencyContact: { name: '', phone: '' },
      responsible: { name: '', cpf: '', rg: '', phone: '' },
      isMinor: false,
      turmas: [], // Limpa as turmas selecionadas
    };
    this.editMode = false;
    this.resetHistoryState(); // Limpa o estado do histórico
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
