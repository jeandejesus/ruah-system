import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // A URL do backend para o login
  private apiUrl = 'http://localhost:3000/auth/login'; // Altere para a URL correta do seu backend

  constructor(private http: HttpClient) {}

  // Método para fazer login
  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(
      this.apiUrl,
      { email, password },
      { headers, withCredentials: true }
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout() {
    localStorage.removeItem('authToken');
  }
}
