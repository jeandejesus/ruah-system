// src/app/notification/notification.service.ts
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Isso registra o serviço na raiz da aplicação, tornando-o disponível globalmente.
})
export class NotificationService {
  // ✨ Substitua esta chave pela sua Chave Pública VAPID do backend NestJS ✨
  readonly VALID_PUBLIC_KEY =
    'BMsge5mDL0_eUOtxONeKm5MrT4ZGA2RY2KCt2x-xIzCMtMEWM7thyxclQCGY51z9nRrpoINF_DxKyI7L7pnAW-U';

  // URL do seu backend NestJS para inscrever o usuário
  readonly BACKEND_URL = 'https://ruah-system-back.onrender.com/auth/subscribe'; // Ajuste conforme a URL do seu backend

  constructor(private swPush: SwPush, private http: HttpClient) {}

  requestPermission() {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Permissão concedida para notificações');
      }
    });
  }

  subscribeToNotifications() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VALID_PUBLIC_KEY,
      })
      .then((sub) => {
        // envie para o servidor Node
        this.http.post(this.BACKEND_URL, sub).subscribe();
      })
      .catch((err) => console.error('Erro ao se inscrever', err));
  }

  /**
   * Envia a assinatura para o backend.
   * @param subscription A PushSubscription a ser enviada.
   * @returns Um Observable da requisição HTTP.
   */
  private addPushSubscriber(subscription: PushSubscription): Observable<any> {
    return this.http.post(this.BACKEND_URL, subscription);
  }

  /**
   * Opcional: Escuta por mensagens push recebidas quando o PWA está em primeiro plano.
   * O Service Worker já lida com a exibição da notificação, mas você pode ter lógica extra aqui.
   */
  listenForPushMessages(): void {
    this.swPush.messages.subscribe((message) => {
      console.log('📬 Mensagem Push recebida no foreground:', message);
      // Exemplo: exibir um toast ou badge na UI
    });
  }

  /**
   * Opcional: Escuta por cliques em notificações.
   */
  listenForNotificationClicks(): void {
    this.swPush.notificationClicks.subscribe(({ action, notification }) => {
      console.log('👆 Notificação clicada:', action, notification);
      // Exemplo: redirecionar o usuário para uma URL específica da notificação
      if (notification.data && notification.data.url) {
        window.open(notification.data.url, '_blank');
      }
    });
  }
}
