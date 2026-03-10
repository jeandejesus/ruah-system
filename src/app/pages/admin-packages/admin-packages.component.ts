import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PackagesService } from 'src/app/core/services/packages.service';
import { PackagePlan } from 'src/app/shared/packages.constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-packages',
  templateUrl: './admin-packages.component.html',
  styleUrls: ['./admin-packages.component.scss'],
})
export class AdminPackagesComponent implements OnInit {
  packages: PackagePlan[] = [];
  form!: FormGroup;
  loading = false;
  saving = false;
  editingId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private packagesService: PackagesService,
    private toast: ToastrService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPackages();
  }

  initForm(pkg?: PackagePlan): void {
    this.form = this.fb.group({
      key: [pkg?.key ?? '', [Validators.required, Validators.min(1)]],
      title: [pkg?.title ?? '', [Validators.required]],
      subtitle: [pkg?.subtitle ?? ''],
      price: [pkg?.price ?? '', [Validators.required, Validators.min(0.01)]],
      installmentCount: [pkg?.installmentCount ?? 6, [Validators.required, Validators.min(1)]],
      installmentValue: [{ value: pkg?.installmentValue ?? '', disabled: true }, [Validators.required, Validators.min(0.01)]],
      highlight: [pkg?.highlight ?? false],
    });

    this.form.get('price')?.valueChanges.subscribe(() => this.calculateInstallmentValue());
    this.form.get('installmentCount')?.valueChanges.subscribe(() => this.calculateInstallmentValue());
  }

  private calculateInstallmentValue(): void {
    const price = this.form.get('price')?.value;
    const count = this.form.get('installmentCount')?.value;

    if (price && count && count > 0) {
      const value = price / count;
      this.form.get('installmentValue')?.setValue(parseFloat(value.toFixed(2)), { emitEvent: false });
    } else {
      this.form.get('installmentValue')?.setValue('', { emitEvent: false });
    }
  }

  loadPackages(): void {
    this.loading = true;
    this.packagesService.getAll().subscribe({
      next: (pkgs) => {
        this.packages = pkgs;
        this.loading = false;
      },
      error: () => {
        this.toast.error('Erro ao carregar pacotes');
        this.loading = false;
      },
    });
  }

  startEdit(pkg: PackagePlan): void {
    this.editingId = pkg._id ?? null;
    this.initForm(pkg);
    setTimeout(() => {
      document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  cancelEdit(): void {
    this.editingId = null;
    this.initForm();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Preencha todos os campos obrigatórios.');
      return;
    }

    const data = this.form.getRawValue();
    this.saving = true;

    if (this.editingId) {
      this.packagesService.update(this.editingId, data).subscribe({
        next: () => {
          this.toast.success('Pacote atualizado com sucesso!');
          this.cancelEdit();
          this.loadPackages();
          this.saving = false;
        },
        error: (err) => {
          this.toast.error(err?.error?.message || 'Erro ao atualizar pacote');
          this.saving = false;
        },
      });
    } else {
      this.packagesService.create(data).subscribe({
        next: () => {
          this.toast.success('Pacote criado com sucesso!');
          this.initForm();
          this.loadPackages();
          this.saving = false;
        },
        error: (err) => {
          this.toast.error(err?.error?.message || 'Erro ao criar pacote');
          this.saving = false;
        },
      });
    }
  }

  delete(pkg: PackagePlan): void {
    if (!confirm(`Deseja excluir o pacote "${pkg.title}"?`)) return;
    this.packagesService.delete(pkg._id!).subscribe({
      next: () => {
        this.toast.success('Pacote excluído!');
        this.loadPackages();
      },
      error: () => this.toast.error('Erro ao excluir pacote'),
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
}
