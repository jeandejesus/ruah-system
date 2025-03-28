import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var Stripe: any;

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  stripe: any;
  elements: any;
  card: any;

  constructor(private http: HttpClient) {
    this.stripe = Stripe(
      'pk_test_51QpIMGRo3ZY88TMxuC46QuEzoLul6Je5CxDtUBvsMcchA218KwV2FJGmAgAwG4WyavliB4pct50DOiJCYY8A0ptJ00v8rs72Yq'
    );
    this.elements = this.stripe.elements();
    this.card = this.elements.create('card');
  }

  // Criar uma sessão de pagamento
  createCheckoutSession() {
    return this.http
      .post<{ sessionId: string }>('/api/create-payment', {})
      .toPromise();
  }

  // Inicializar o Stripe Elements no frontend
  initializePaymentForm(elementId: string) {
    this.card.mount(`#${elementId}`);
  }

  // Criar o pagamento
  async handlePayment() {
    const session = await this.createCheckoutSession();

    const { error } = await this.stripe.redirectToCheckout({});

    if (error) {
      console.log('Error:', error.message);
    }
  }
}
