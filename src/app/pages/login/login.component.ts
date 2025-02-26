import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';  // Para armazenar o nome de usuário
  password: string = '';  // Para armazenar a senha
  errorMessage: string = '';

  constructor(private authService: AuthenticationService, private router: Router) {}

   onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
         console.log('Login bem-sucedido:', response);
        localStorage.setItem('authToken', response.token);  // Armazena o token no localStorage
        this.router.navigate(['/dashboard']);  // Redireciona para a página do dashboard
      },
      (error) => {
        // Se ocorrer um erro, mostramos a mensagem de erro
        this.errorMessage = error.error.message || 'Erro ao fazer login';
      }
    );
  }
}
