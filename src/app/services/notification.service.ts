import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  // Sua chave pública VAPID
  readonly VALID_PUBLIC_KEY =
    'BMsge5mDL0_eUOtxONeKm5MrT4ZGA2RY2KCt2x-xIzCMtMEWM7thyxclQCGY51z9nRrpoINF_DxKyI7L7pnAW-U';

  // Endpoint do backend para registrar subscription
  readonly BACKEND_URL = 'https://ruah-system-back.onrender.com/auth/subscribe';

  constructor(private swPush: SwPush, private http: HttpClient) {}

  // Método para pedir permissão para notificações
  requestPermission(): Promise<NotificationPermission> {
    return Notification.requestPermission().then((permission) => {
      console.log('Permissão para notificações:', permission);
      return permission;
    });
  }

  // Inscreve o usuário nas notificações push, garantindo que o SW esteja pronto
  async subscribeToNotifications(): Promise<void> {
    try {
      console.log('Aguardando service worker estar pronto...');
      const registration = await navigator.serviceWorker.ready;

      if (Notification.permission === 'denied') {
        console.warn(
          'Permissão para notificações negada. Solicite ao usuário que habilite nas configurações.'
        );
        return;
      }

      if (Notification.permission !== 'granted') {
        const permission = await this.requestPermission();
        if (permission !== 'granted') {
          console.warn('Permissão para notificações não concedida.');
          return;
        }
      }

      console.log('Tentando se inscrever para notificações...');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.VALID_PUBLIC_KEY,
      });

      console.log('Assinatura recebida:', subscription);

      // Envia a inscrição para o backend
      this.http.post(this.BACKEND_URL, subscription).subscribe({
        next: () =>
          console.log('Subscription registrada no backend com sucesso.'),
        error: (err) =>
          console.error('Erro ao registrar subscription no backend:', err),
      });
    } catch (err) {
      console.error('Erro ao se inscrever para notificações:', err);
    }
  }

  listenForPushMessages(): void {
    this.swPush.messages.subscribe((message) => {
      console.log('Mensagem push recebida no foreground:', message);
    });
  }

  listenForNotificationClicks(): void {
    this.swPush.notificationClicks.subscribe(({ action, notification }) => {
      console.log('Notificação clicada:', action, notification);
      if (notification.data && notification.data.url) {
        window.open(notification.data.url, '_blank');
      }
    });
  }
}
