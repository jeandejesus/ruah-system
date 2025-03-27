import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './guards/auth.guard';
import { TurmasComponent } from './pages/turmas/turmas.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LocaisComponent } from './pages/locais/locais.component';
import { AlunosComponent } from './pages/alunos/alunos.component';
import { AlunosListagemComponent } from './pages/alunos-listagem/alunos-listagem.component';
import { PagamentosComponent } from './pages/pagamentos/pagamentos.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'painel',
        children: [
          { path: 'dashboard', component: DashboardComponent },
          { path: 'turmas', component: TurmasComponent },
          { path: 'locais', component: LocaisComponent },
          { path: 'pagamentos', component: PagamentosComponent },
          {
            path: 'alunos',
            children: [
              { path: 'cadastro', component: AlunosComponent },
              { path: 'lista', component: AlunosListagemComponent },
            ],
          },
        ],
        canActivate: [() => authGuard('owner')], // Apenas administradores
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [() => authGuard('owner')], // Apenas administradores
      },
      {
        path: 'locais',
        loadChildren: () =>
          import('./pages/locais/locais.module').then((m) => m.LocaisModule),
      },
    ],
  },

  { path: 'login', component: LoginComponent },

  { path: '**', redirectTo: 'login' }, // Redireciona qualquer rota inválida para login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
