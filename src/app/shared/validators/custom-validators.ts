import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  /**
   * Valida CPF ou CNPJ
   */
  static cpfCnpj(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.replace(/[^\d]/g, '');
    if (!value) return null;

    if (value.length === 11) {
      return CustomValidators.validateCPF(value) ? null : { cpfInvalid: true };
    } else if (value.length === 14) {
      return CustomValidators.validateCNPJ(value) ? null : { cnpjInvalid: true };
    } else {
      return { cpfCnpjInvalid: true };
    }
  }

  /**
   * Valida número do cartão de crédito (Luhn Algorithm)
   */
  static creditCard(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.replace(/\s+/g, '');
    if (!value) return null;

    if (!/^\d{13,19}$/.test(value)) {
      return { cardInvalid: true };
    }

    let sum = 0;
    let shouldDouble = false;
    for (let i = value.length - 1; i >= 0; i--) {
      let digit = parseInt(value.charAt(i));
      if (shouldDouble) {
        if ((digit *= 2) > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0 ? null : { cardInvalid: true };
  }

  /**
   * Valida se a data de expiração do cartão é futura
   */
  static cardExpiry(monthKey: string, yearKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const month = group.get(monthKey)?.value;
      const year = group.get(yearKey)?.value;

      if (!month || !year) return null;

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      const expMonth = parseInt(month, 10);
      const expYear = parseInt(year, 10);

      if (isNaN(expMonth) || isNaN(expYear)) return { expiryInvalid: true };

      if (expYear < currentYear) {
        return { expiryPast: true };
      }

      if (expYear === currentYear && expMonth < currentMonth) {
        return { expiryPast: true };
      }

      if (expMonth < 1 || expMonth > 12) {
        return { expiryInvalid: true };
      }

      return null;
    };
  }

  /**
   * Valida nome completo (pelo menos duas palavras)
   */
  static fullName(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.trim();
    if (!value) return null;

    const parts = value.split(/\s+/);
    return parts.length >= 2 ? null : { fullNameInvalid: true };
  }

  private static validateCPF(cpf: string): boolean {
    if (/^(\d)\1+$/.test(cpf)) return false;
    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  private static validateCNPJ(cnpj: string): boolean {
    if (/^(\d)\1+$/.test(cnpj)) return false;
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
  }
}
