import { Component, OnInit } from '@angular/core';
import { PagamentoService } from 'src/app/core/services/pagamento.service';

@Component({
  selector: 'app-pagamentos',
  templateUrl: './pagamentos.component.html',
  styleUrls: ['./pagamentos.component.scss'],
})
export class PagamentosComponent implements OnInit {
  customers: any[] = [];
  searchText: string = '';

  constructor(private pagamentoService: PagamentoService) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes() {
    this.pagamentoService.getCustomersStatus().subscribe((data) => {
      this.customers = data;
    });
  }
}
