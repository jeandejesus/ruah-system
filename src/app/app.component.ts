import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnChanges, OnInit {
  ngOnInit(): void {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Permissão de notificação concedida!');
        } else {
          console.log('Permissão de notificação negada.');
        }
      });
    }
  }
  token = localStorage.getItem('authToken');

  ngOnChanges(changes: SimpleChanges): void {
    this.token = localStorage.getItem('authToken');
  }
  title = 'ruah-system';
}
