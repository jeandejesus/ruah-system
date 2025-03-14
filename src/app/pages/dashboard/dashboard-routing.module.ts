import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { TurmasComponent } from '../turmas/turmas.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [() => authGuard()],
    children: [{ path: 'turmas', component: TurmasComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
