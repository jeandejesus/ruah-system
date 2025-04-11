import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CustomerResponse {
  customers: Customer[];
  hasMore: boolean;
  total?: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  created: Date;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class PagamentosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCustomers(limit: number = 10, startingAfter?: string): Observable<CustomerResponse> {
    let url = `${this.apiUrl}/stripe/customers-with-status?limit=${limit}`;
    if (startingAfter) {
      url += `&startingAfter=${startingAfter}`;
    }
    return this.http.get<CustomerResponse>(url);
  }
} 