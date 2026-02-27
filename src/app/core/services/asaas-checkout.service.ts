import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AsaasCheckoutService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createCustomer(body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.api}/asaas/create-customer`, body, {
      headers,
    });
  }

  tokenizeCard(body: any): Observable<any> {
    return this.http.post(`${this.api}/asaas/tokenize-card`, body);
  }

  createPayment(body: any): Observable<any> {
    return this.http.post(`${this.api}/asaas/create-payment`, body);
  }
}
