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
  subscriptions: FormattedSubscription[];
}

export interface FormattedSubscription {
  id: string;
  status:
    | 'incomplete'
    | 'incomplete_expired'
    | 'trialing'
    | 'active'
    | 'past_due'
    | 'unpaid'
    | 'canceled';
  current_period_end: Date;
  cancel_at: Date | null;
  cancellation_reason: string | null;
  payment_error: string | null; // mensagem detalhada de erro ou expiração
}
@Injectable({
  providedIn: 'root',
})
export class PagamentosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCustomers(
    limit: number = 10,
    startingAfter?: string,
    searchTerm?: string
  ): Observable<CustomerResponse> {
    let url = `${this.apiUrl}/stripe/customers-with-status?limit=${limit}`;
    if (startingAfter) {
      url += `&startingAfter=${startingAfter}`;
    }
    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }
    return this.http.get<CustomerResponse>(url);
  }
}
