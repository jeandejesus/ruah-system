import { Component, OnInit } from '@angular/core';
import { PagamentosService } from './pagamentos.service';

@Component({
  selector: 'app-pagamentos',
  templateUrl: './pagamentos.component.html',
  styleUrls: ['./pagamentos.component.scss']
})
export class PagamentosComponent implements OnInit {
  customers: any[] = [];
  hasMore = false;
  loading = false;
  lastCustomerId: string | undefined = undefined;
  pageSize = 10;

  constructor(private pagamentosService: PagamentosService) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers(loadMore = false) {
    if (this.loading) return;
    
    this.loading = true;
    const startingAfter = loadMore ? this.lastCustomerId : undefined;

    this.pagamentosService.getCustomers(this.pageSize, startingAfter)
      .subscribe({
        next: (response) => {
          if (loadMore) {
            this.customers = [...this.customers, ...response.customers];
          } else {
            this.customers = response.customers;
          }
          
          this.hasMore = response.hasMore;
          if (response.customers.length > 0) {
            this.lastCustomerId = response.customers[response.customers.length - 1].id;
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar clientes:', error);
          this.loading = false;
        }
      });
  }

  loadMore() {
    if (this.hasMore && !this.loading) {
      this.loadCustomers(true);
    }
  }
}
