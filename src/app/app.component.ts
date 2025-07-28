import {
  Component,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { NotificationService } from './services/notification.service';
import { SwPush, SwUpdate } from '@angular/service-worker';
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
    private router: Router,
    private swUpdate: SwUpdate
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.renderer.removeClass(document.body, 'no-scroll');
      });

    if (swUpdate.isEnabled) {
      swUpdate.versionUpdates.subscribe((event) => {
        if (event.type === 'VERSION_READY') {
          if (confirm('Nova versão disponível. Deseja atualizar agora?')) {
            window.location.reload();
          }
        }
      });
    }
  }

  async ngOnInit(): Promise<Promise<Promise<void>>> {}
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
}
