import {
  Component,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { NotificationService } from './services/notification.service';
import { SwPush } from '@angular/service-worker';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnChanges, OnInit {
  readonly VAPID_PUBLIC_KEY =
    'BMsge5mDL0_eUOtxONeKm5MrT4ZGA2RY2KCt2x-xIzCMtMEWM7thyxclQCGY51z9nRrpoINF_DxKyI7L7pnAW-U';
  constructor(
    private notificationService: NotificationService,
    private swPush: SwPush,
    private renderer: Renderer2,
    private router: Router
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.renderer.removeClass(document.body, 'no-scroll');
      });
  }

  async ngOnInit(): Promise<Promise<Promise<void>>> {
    // console.log('🚀 Inicializando o AppComponent...', this.swPush.isEnabled);
    // if (this.swPush.isEnabled) {
    //   // Verifica o status da permissão atual
    //   if (
    //     Notification.permission === 'default' ||
    //     Notification.permission === 'denied'
    //   ) {
    //     // Se a permissão ainda não foi dada ou foi negada, solicite.
    //     // É melhor fazer isso após uma interação do usuário para evitar ser bloqueado pelo navegador.
    //     this.requestPushSubscription();
    //   } else if (Notification.permission === 'granted') {
    //     // Se a permissão já foi concedida, podemos tentar inscrever novamente
    //     // ou apenas garantir que o listener de mensagens esteja ativo.
    //     console.log(
    //       'Permissão de notificação já concedida. Garantindo inscrição e ouvintes...'
    //     );
    //     this.notificationService.requestPermissionAndSubscribe(); // Tenta inscrever novamente se necessário
    //   }
    // } else {
    //   console.warn(
    //     '⚠️ Service Worker não habilitado. As notificações push não funcionarão.'
    //   );
    // }
    // // Opcional: Ativar os listeners para mensagens e cliques se o app estiver em foreground
    // this.notificationService.listenForPushMessages();
    // this.notificationService.listenForNotificationClicks();
  }
  token = localStorage.getItem('authToken');

  ngOnChanges(changes: SimpleChanges): void {
    this.token = localStorage.getItem('authToken');
  }
  title = 'ruah-system';

  urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
  }

  requestPushSubscription(): void {
    console.log('🚀 Solicitando inscrição para notificações push...');
    this.notificationService.requestPermissionAndSubscribe();
  }
}
