import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocaisRoutingModule } from './locais-routing.module';
import { LocaisComponent } from './locais.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LocaisComponent],
  imports: [CommonModule, LocaisRoutingModule, FormsModule],
})
export class LocaisModule {}
