import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { SchoolService } from 'src/app/core/services/school.service';
import { School } from 'src/app/interfaces/school.interface';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string = ''; // Para armazenar o nome de usuário
  password: string = ''; // Para armazenar a senha
  passwordConfimation: string = '';
  errorMessage: string = '';
  loading = false;
  path: string = '/login'; // Para armazenar o caminho atual
  token: string = ''; // Para armazenar o token da URL
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private schoolService: SchoolService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.authService.verificaApiRunning().subscribe();
    const pathname = window.location.pathname;
    if (pathname === '/recuperar-senha') {
      this.path = pathname;
      this.route.queryParams.subscribe((params) => {
        this.token = params['token'];
      });
    }
  }

  async onSubmit() {
    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        localStorage.setItem('authToken', response.access_token); // Armazena o token no localStorage

        this.checkSchool(response);
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            this.notificationService.subscribeToNotifications();
          } else if (permission === 'denied') {
            console.warn('Usuário negou as notificações');
          } else {
            console.log('Usuário ainda não escolheu (default)');
          }
        });
      },
      error: (error) => {
        console.error('Erro no login:', error);
        this.loading = false;
        this.toastr.error(
          error.error || 'Email ou senha inválidos',
          'Erro no Login'
        );
      },
    });
  }

  private async checkSchool(login: any) {
    this.schoolService.getSchoolByUserId(login.user.id).subscribe({
      next: (school: School) => {
        if (school) {
          this.router.navigate(['/painel/pagamentos/assinaturas']); // Redireciona para a página do dashboard
        } else {
          this.router.navigate(['/criar-escola']);
        }
      },
      error: (error) => {
        if (error.status === 404) {
          this.router.navigate(['/criar-escola']);
        } else {
          this.toastr.error(error.message || 'Erro ao verificar escola');
        }
      },
    });
  }

  // Método para redirecionar para a página de recuperação de senha

  forgotPassword() {
    this.authService.resetSenha(this.email).subscribe({
      next: () => {
        this.toastr.success(
          'Verifique seu email para redefinir sua senha.',
          'Email enviado'
        );
      },
      error: (erro) => {
        this.loading = false;
        this.toastr.error(
          erro.error.message || 'Email ou senha inválidos',
          'Erro no Login'
        );
      },
    });
  }

  async onSubmitSenha() {
    this.loading = true;

    if (this.password !== this.passwordConfimation) {
      this.toastr.error('As senhas não coincidem', 'Erro no Login');
      this.loading = false;
      return;
    } else {
      this.authService
        .resetPassword(this.token, this.passwordConfimation)
        .subscribe({
          next: () => {
            this.toastr.success(
              'Senha redefinida com sucesso. Você pode fazer login agora.'
            );
            this.router.navigate(['/login']);
          },
          error: (erro) => {
            this.loading = false;
            this.toastr.error(
              erro.error.message || 'erro ao redefinir a senha'
            );
          },
        });
    }
  }
}
