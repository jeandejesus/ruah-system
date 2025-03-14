import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocaisComponent } from './locais.component';

const routes: Routes = [{ path: '', component: LocaisComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocaisRoutingModule { }
