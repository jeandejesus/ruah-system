// src/app/components/loading-spinner/loading-spinner.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent {
  // O componente recebe um valor booleano de fora
  // para saber se deve mostrar o spinner.
  @Input() isLoading: boolean = false;

  // Você pode opcionalmente receber o texto de carregamento também
  @Input() loadingText: string = 'Carregando...';
}
