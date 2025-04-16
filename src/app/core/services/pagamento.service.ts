import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PagamentoService {
  private apiUrl = `${environment.apiUrl}/stripe/customers-with-status`;

  constructor(private http: HttpClient) {}

  getCustomersStatus(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
