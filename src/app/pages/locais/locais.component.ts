import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Local, LocaisService } from 'src/app/core/services/locais.service';

@Component({
  selector: 'app-locais',
  templateUrl: './locais.component.html',
  styleUrls: ['./locais.component.scss'],
})
export class LocaisComponent implements OnInit {
  locais: Local[] = [];
  localAtual: Local = { name: '', address: '' };
  editando = false;
  modalInstance: bootstrap.Modal | undefined;

  constructor(private locaisService: LocaisService) {}

  ngOnInit(): void {
    this.carregarLocais();
  }

  carregarLocais() {
    this.locaisService.getLocais().subscribe((data) => {
      this.locais = data;
    });
  }

  abrirModal(local?: Local) {
    this.editando = !!local;
    this.localAtual = local ? { ...local } : { name: '', address: '' };

    const modalElement = document.getElementById('localModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  fecharModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  // Função de edição agora chama o serviço diretamente
  editarLocal(local: Local) {
    this.localAtual = { ...local }; // Atualiza o local atual para edição
    this.abrirModal(local); // Abre o modal para edição
  }

  salvarLocal() {
    if (this.editando && this.localAtual._id) {
      this.locaisService
        .updateLocal(this.localAtual._id, this.localAtual)
        .subscribe(() => {
          this.carregarLocais();
          this.fecharModal();
        });
    } else {
      this.locaisService.createLocal(this.localAtual).subscribe(() => {
        this.carregarLocais();
        this.fecharModal();
      });
    }
  }

  excluirLocal(id: string | undefined) {
    if (id && confirm('Tem certeza que deseja excluir?')) {
      this.locaisService.deleteLocal(id).subscribe(() => {
        this.carregarLocais();
      });
    }
  }
}
