import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AsaasCheckoutService } from '../../core/services/asaas-checkout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PackagePlan } from 'src/app/shared/packages.constants';
import { PackagesService } from 'src/app/core/services/packages.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';


@Component({
  selector: 'app-checkout-cartao',
  templateUrl: './checkout-cartao.component.html',
  styleUrls: ['./checkout-cartao.component.scss'],
})
export class CheckoutCartaoComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  loading = false;
  createdPayment: any | null = null;
  loadingPlanos = true;

  planos: PackagePlan[] = [];

  constructor(
    private fb: FormBuilder,
    private api: AsaasCheckoutService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private router: Router,
    private packagesService: PackagesService,
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      const anchor = document.getElementById('top-anchor');
      anchor?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 50);
  }

  ngOnInit(): void {
    this.router.navigate([], {
      fragment: 'top',
      replaceUrl: true,
      queryParamsHandling: 'preserve'
    });

    const qp = this.route.snapshot.queryParamMap;
    const planoKeyQP = qp.get('pacote');

    const valueQP = Number(qp.get('value') || 0);
    const customerIdQP = qp.get('customerId') || '';
    const dueDate = qp.get('dueDate') || this.today();

    this.form = this.fb.group({
      planoKey: [null, [Validators.required]],
      customerId: [customerIdQP],
      value: [
        valueQP || null,
        [Validators.required, Validators.min(1)],
      ],
      installmentCount: [6, [Validators.min(1), Validators.max(6)]],
      dueDate: [dueDate, [Validators.required]],
      holderName: ['', [Validators.required, CustomValidators.fullName]],
      number: ['', [Validators.required, CustomValidators.creditCard]],
      expiryMonth: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)]],
      expiryYear: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      ccv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      name: ['', [Validators.required, CustomValidators.fullName]],
      email: ['', [Validators.required, Validators.email]],
      cpfCnpj: ['', [Validators.required, CustomValidators.cpfCnpj]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      addressNumber: ['', [Validators.required]],
      mobilePhone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],
    }, {
      validators: [CustomValidators.cardExpiry('expiryMonth', 'expiryYear')]
    });

    // Atualiza valor automaticamente ao trocar o plano
    this.form.get('planoKey')?.valueChanges.subscribe((key: number) => {
      if (!key) return;
      const plano = this.planos.find((p) => p.key === key);
      if (plano) {
        this.form.patchValue(
          { value: plano.price, installmentCount: plano.installmentCount },
          { emitEvent: false },
        );
      }
    });

    // Busca planos da API e inicializa o formulário já com o plano pré-selecionado
    this.packagesService.getAll().subscribe({
      next: (planos) => {
        this.planos = planos;
        this.loadingPlanos = false;

        const defaultPlano =
          this.planos.find((p) => p.key == Number(planoKeyQP)) ??
          this.planos[0];

        if (defaultPlano) {
          // Utiliza timeout para garantir que os options do *ngFor ja existam no DOM
          setTimeout(() => {
            this.form.patchValue({
              planoKey: defaultPlano.key,
              value: valueQP || defaultPlano.price,
              installmentCount: defaultPlano.installmentCount ?? 6
            });
          });
        }
      },
      error: () => {
        this.toast.error('Erro ao carregar planos. Tente novamente.');
        this.loadingPlanos = false;
      },
    });
  }

  private today(): string {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }

  async submit() {
    console.log('Form data:', this.form.value);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    this.loading = true;
    this.createdPayment = null;

    const f = this.form.value;

    try {
      // 0) criar cliente no Asaas se ainda n�o existir
      let customerId: string = f.customerId?.trim();
      if (!customerId) {
        const customerPayload: any = {
          name: f.name,
          email: f.email || undefined,
          cpfCnpj: f.cpfCnpj ? String(f.cpfCnpj).replace(/\D/g, '') : undefined,
          mobilePhone: f.mobilePhone ? String(f.mobilePhone).replace(/\D/g, '') : undefined,
          postalCode: f.postalCode ? String(f.postalCode).replace(/\D/g, '') : undefined,
          addressNumber: f.addressNumber || undefined,
        };
        const created = await this.api
          .createCustomer(customerPayload)
          .toPromise();
        customerId = created?.id;
        if (!customerId) {
          throw new Error('Falha ao criar cliente no Asaas');
        }
        this.form.patchValue({ customerId });
      }

      // 1) tokeniza o cart�o
      const tokenResp = await this.api
        .tokenizeCard({
          customer: customerId,
          creditCard: {
            holderName: f.holderName,
            number: String(f.number).replace(/\s+/g, ''),
            expiryMonth: String(f.expiryMonth).padStart(2, '0'),
            expiryYear: String(f.expiryYear),
            ccv: String(f.ccv),
          },
          creditCardHolderInfo: {
            name: f.name,
            email: f.email || undefined,
            cpfCnpj: f.cpfCnpj ? String(f.cpfCnpj).replace(/\D/g, '') : undefined,
            postalCode: f.postalCode ? String(f.postalCode).replace(/\D/g, '') : undefined,
            addressNumber: f.addressNumber || undefined,
            mobilePhone: f.mobilePhone ? String(f.mobilePhone).replace(/\D/g, '') : undefined,
          },
        })
        .toPromise();

      const creditCardToken = tokenResp?.creditCardToken;
      if (!creditCardToken) {
        throw new Error('Falha ao tokenizar o cart�o.');
      }

      // 2) cria o pagamento avulso (parcelado opcional)
      const paymentResp = await this.api
        .createPayment({
          customerId,
          value: Number(f.value),
          dueDate: f.dueDate,
          description: f.description || undefined,
          installmentCount: Number(f.installmentCount) || 1,
          creditCardToken,
        })
        .toPromise();

      this.createdPayment = paymentResp;
      this.toast.success('Pagamento criado com sucesso! Fale conosco no WhatsApp.');
    } catch (err: any) {
      console.error(err);
      this.toast.error(
        err?.error?.message || err?.message || 'Erro ao processar pagamento',
      );
    } finally {
      this.loading = false;
    }
  }

  selectPlano(planoKey: any) {
    this.form.patchValue({ planoKey });
  }
}
