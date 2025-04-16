import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { SchoolService } from 'src/app/core/services/school.service';
import { School } from 'src/app/interfaces/school.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = ''; // Para armazenar o nome de usuário
  password: string = ''; // Para armazenar a senha
  errorMessage: string = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private schoolService: SchoolService
  ) {}

  async onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log(response);
        localStorage.setItem('authToken', response.access_token); // Armazena o token no localStorage

        this.checkSchool(response);
      },
      error: (error) => {
        // Se ocorrer um erro, mostramos a mensagem de erro
        this.errorMessage = error.error.message || 'Erro ao fazer login';
      },
    });
  }

  private async checkSchool(login: any) {
    this.schoolService.getSchoolByUserId(login.user.id).subscribe({
      next: (school: School) => {
        console.log('Escola:', school);
        if (school) {
          this.router.navigate(['/painel']); // Redireciona para a página do dashboard
        } else {
          this.router.navigate(['/criar-escola']);
        }
      },
      error: (error) => {
        if (error.status === 404) {
          this.router.navigate(['/criar-escola']);
        } else {
          console.error('Erro ao verificar escola:', error);
        }
      },
    });
  }
}
