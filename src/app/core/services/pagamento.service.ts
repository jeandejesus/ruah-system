import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PagamentoService {
  private apiUrl = 'http://localhost:3000/stripe/customers-with-status'; // URL do backend

  constructor(private http: HttpClient) {}

  getCustomersStatus(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
