import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

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
    private router: Router
  ) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido:', response.usuarioLogado); // Log para debug
        localStorage.setItem('authToken', response.usuarioLogado.accessToken); // Armazena o token no localStorage
        this.router.navigate(['/dashboard']); // Redireciona para a página do dashboard
      },
      error: (error) => {
        // Se ocorrer um erro, mostramos a mensagem de erro
        this.errorMessage = error.error.message || 'Erro ao fazer login';
      },
    });
  }
}
