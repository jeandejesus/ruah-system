 import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('authToken');

    console.log('Verificando token:', token); // Log para debug

    if (token) {
      return true; // Permite acesso
    } else {
      console.log('Redirecionando para login...');
      this.router.navigate(['/login']);
      return false;
    }
  }

}
