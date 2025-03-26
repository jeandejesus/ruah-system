import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard = (roleRequired?: string) => {
  // ⬅️ Aqui o parâmetro roleRequired é definido
  const router = inject(Router);
  const http = inject(HttpClient);
  const jwtHelper = new JwtHelperService();
  const token = localStorage.getItem('authToken');

  if (!token || jwtHelper.isTokenExpired(token)) {
    console.log('Token inválido ou expirado. Redirecionando para login...');
    router.navigate(['/login']);
    return false;
  }
  const decodedToken: any = jwtHelper.decodeToken(token);
  console.log('Token decodificado:', decodedToken);

  if (roleRequired && decodedToken.role !== roleRequired) {
    console.log('Usuário sem permissão. Redirecionando para "não autorizado".');
    router.navigate(['/not-authorized']);
    return false;
  }

  return http
    .get<{ valid: boolean }>('http://localhost:3000/auth/validate-token')
    .pipe(
      map((response) => {
        if (response.valid) {
          return true;
        } else {
          console.log('Token inválido. Redirecionando...');
          router.navigate(['/login']);
          return false;
        }
      }),
      catchError(() => {
        console.log('Erro ao validar token. Redirecionando...');
        router.navigate(['/login']);
        return of(false);
      })
    );
};
