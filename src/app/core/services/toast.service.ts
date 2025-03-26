import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastr: ToastrService) {}

  showSuccess() {
    this.toastr.success('Operação realizada com sucesso!');
  }

  showError() {
    this.toastr.error('Ocorreu um erro. Tente novamente.');
  }
}
