import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importe o FormsModule
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TurmasComponent } from './pages/turmas/turmas.component';
import { LayoutComponent } from './layout/layout.component';
import { AlunosComponent } from './pages/alunos/alunos.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Necessário para animações
import { CommonModule } from '@angular/common';
import { AlunosListagemComponent } from './pages/alunos-listagem/alunos-listagem.component';
import { AlunoFilterPipe } from './pipes/aluno-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    TurmasComponent,
    AlunosListagemComponent,
    AlunosComponent,
    LayoutComponent,
    AlunoFilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    BrowserAnimationsModule, // Importando a animação
    ToastrModule.forRoot({
      timeOut: 3000, // Tempo de exibição do toast
      positionClass: 'toast-top-right', // Posição do toast
      preventDuplicates: true, // Evita toasts duplicados
    }),
    CommonModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
