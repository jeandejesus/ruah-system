import { Component, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnChanges {
  token = localStorage.getItem('authToken');

  ngOnChanges(changes: SimpleChanges): void {
    this.token = localStorage.getItem('authToken');
  }
  title = 'ruah-system';
}
