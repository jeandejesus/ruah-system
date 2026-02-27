import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AsaasCheckoutService } from '../../core/services/asaas-checkout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PackagePlan, RUAH_PACKAGES } from 'src/app/shared/packages.constants';

interface PlanoOption {
  key: string;
  label: string;
  value: number;
  description: string;
}

@Component({
  selector: 'app-checkout-cartao',
  templateUrl: './checkout-cartao.component.html',
  styleUrls: ['./checkout-cartao.component.scss'],
})
export class CheckoutCartaoComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  loading = false;
  createdPayment: any | null = null;

  planos: PackagePlan[] = RUAH_PACKAGES;

  constructor(
    private fb: FormBuilder,
    private api: AsaasCheckoutService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private router: Router,
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
    console.log('Query param planoKey:', planoKeyQP);

    const valueQP = Number(qp.get('value') || 0);
    const descriptionQP = qp.get('description') || '';
    const customerIdQP = qp.get('customerId') || '';
    const dueDate = qp.get('dueDate') || this.today();

    const defaultPlano = this.planos[Number(planoKeyQP) - 1] || this.planos[0];

    this.form = this.fb.group({
      // sele��o do plano
      planoKey: [defaultPlano.key, [Validators.required]],

      // pagamento
      customerId: [customerIdQP], // opcional no primeiro contato
      value: [
        valueQP || defaultPlano.price,
        [Validators.required, Validators.min(1)],
      ],
      installmentCount: [6, [Validators.min(1), Validators.max(6)]],
      dueDate: [dueDate, [Validators.required]],

      // dados do cart�o
      holderName: ['', Validators.required],
      number: ['', [Validators.required, Validators.minLength(13)]],
      expiryMonth: ['', [Validators.required, Validators.minLength(2)]],
      expiryYear: ['', [Validators.required, Validators.minLength(4)]],
      ccv: ['', [Validators.required, Validators.minLength(3)]],

      // dados do titular/cliente (para criar no Asaas se necessrio)
      name: ['', Validators.required],
      email: ['', [Validators.email]],
      cpfCnpj: [''],
      postalCode: [''],
      addressNumber: [''],
      mobilePhone: [''],
    });

    // Reage � troca do plano para atualizar valor/descri��o automaticamente
    this.form.get('planoKey')?.valueChanges.subscribe((key: number) => {
      console.log('Plano selecionado:', key);
      const plano = this.planos.find((p) => p.key == key) || defaultPlano;
      console.log('Dados do plano encontrado:', plano);
      this.form.patchValue({ value: plano.price }, { emitEvent: false });
    });
  }

  private today(): string {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }

  async submit() {
    console.log('Form data:', this.form.value);
    if (this.form.invalid) {
      this.toast.error('Preencha os campos obrigat�rios.');
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
          cpfCnpj: f.cpfCnpj || undefined,
          mobilePhone: f.mobilePhone || undefined,
          postalCode: f.postalCode || undefined,
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
            cpfCnpj: f.cpfCnpj || undefined,
            postalCode: f.postalCode || undefined,
            addressNumber: f.addressNumber || undefined,
            mobilePhone: f.mobilePhone || undefined,
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
