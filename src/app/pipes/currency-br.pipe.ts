import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'currencyBr',
})
export class CurrencyBrPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: any): string | null {
    if (value === null || value === undefined || value === '') {
      return 'R$ 0,00';
    }

    // Certifique-se de que o valor é um número
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) {
      return 'R$ 0,00';
    }

    // Use o DecimalPipe do Angular para formatar o número com 2 casas decimais.
    // '1.2-2' significa: mínimo de 1 dígito inteiro, mínimo de 2 e máximo de 2 decimais.
    const formattedValue = this.decimalPipe.transform(
      numberValue,
      '1.2-2',
      'pt-BR'
    );

    // Retorne o valor formatado com o prefixo R$
    return `R$ ${formattedValue}`;
  }
}
