import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import {
  PagamentosService,
  Customer,
  CustomerResponse,
} from './pagamentos.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-pagamentos',
  templateUrl: './pagamentos.component.html',
  styleUrls: ['./pagamentos.component.scss'],
})
export class PagamentosComponent implements OnInit {
  @ViewChild('loadMoreAnchor') loadMoreAnchor!: ElementRef;

  customers: Customer[] = [];
  hasMore = false;
  loading = false;
  lastCustomerId: string | undefined = undefined;
  pageSize = 9;
  searchText = '';
  private searchSubject = new Subject<string>();
  private isSearching = false;
  carregando = true;
  private shouldScroll = false; // <-- controla quando rolar

  constructor(
    private pagamentosService: PagamentosService,
    private cdr: ChangeDetectorRef
  ) {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.searchText = searchTerm;
        this.isSearching = !!searchTerm;
        this.resetAndLoad();
      });
  }

  ngOnInit() {
    this.loadCustomers();
  }

  private resetAndLoad() {
    this.customers = [];
    this.lastCustomerId = undefined;
    this.loadCustomers();
  }

  loadCustomers(loadMore = false) {
    this.carregando = true;
    if (this.loading) return;

    this.loading = true;
    const startingAfter = loadMore ? this.lastCustomerId : undefined;

    this.pagamentosService
      .getCustomers(this.pageSize, startingAfter, this.searchText)
      .subscribe({
        next: (response: CustomerResponse) => {
          const newCustomers = response.customers;

          if (loadMore) {
            this.customers = [
              ...this.customers,
              ...newCustomers.filter(
                (newCustomer) =>
                  !this.customers.some(
                    (existing) => existing.id === newCustomer.id
                  )
              ),
            ];
            this.shouldScroll = true; // marca que precisa rolar
          } else {
            this.customers = newCustomers;
          }

          this.hasMore =
            response.hasMore ||
            (this.isSearching && newCustomers.length === this.pageSize);

          if (newCustomers.length > 0) {
            this.lastCustomerId = newCustomers[newCustomers.length - 1].id;
          }

          this.loading = false;
          this.carregando = false;

          // força detecção de mudanças para garantir que HTML foi atualizado
          this.cdr.detectChanges();

          // se for loadMore, agora sim rola
          if (this.shouldScroll && this.loadMoreAnchor) {
            this.loadMoreAnchor.nativeElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
            this.shouldScroll = false;
          }
        },
        error: (error: Error) => {
          console.error('Erro ao carregar clientes:', error);
          this.loading = false;
          this.carregando = false;
        },
      });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value.length && input.value.length < 3) {
      return;
    }
    this.searchSubject.next(input.value);
  }

  loadMore() {
    if (this.hasMore && !this.loading) {
      this.loadCustomers(true);
    }
  }

  getWhatsappLink(customer: any): string {
    const phone = customer.phone;
    const name = customer.name;
    const error = customer.subscriptions[0]?.payment_error;
    let message = `Olá ${name}, Tudo bem ?`;
    if (error) {
      message = `Olá ${name}, seu pagamento está com o seguinte erro: ${error}`;
    }
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }
}
