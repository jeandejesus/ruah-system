import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription } from 'rxjs';
import { AlunoService } from 'src/app/core/services/aluno.service';
import { SchoolService } from 'src/app/core/services/school.service';
import { QueryParams } from 'src/app/interfaces/query.interface';
import { School } from 'src/app/interfaces/school.interface';
import { PagamentosService } from '../pagamentos/pagamentos.service';
// ... outros imports

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  jwtHelper = new JwtHelperService();
  noExistesSchool = true;
  errorMessage: string = '';
  school: School = {};
  repasses: any[] = [];
  totalArrecadadoMes: number | null = null;
  loadingTotalMes: boolean = true;
  limitPagementos = 6;
  mostarMenos = false;
  totalArrecadadoMesPix: number | null = null;
  loadingTotalMesPix: boolean = true;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private schoolService: SchoolService,
    private router: Router,
    private pagamentosService: PagamentosService,
    private alunoService: AlunoService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('authToken');
    let decodedToken: any;
    if (token) {
      decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (decodedToken) {
      this.school.userId = decodedToken.sub;
      this.loadingTotalMes = true;
      const query: QueryParams = {
        projection: { _id: 1 },
      };

      const schoolSub = this.schoolService
        .getSchoolById(decodedToken.sub, query)
        .subscribe({
          next: (school) => {
            if (school) {
              this.noExistesSchool = false;
              this.carregarProximosRepasses();
              const alunoSub = this.alunoService
                .getTotalPixReceivedInMonth()
                .subscribe({
                  next: (response) => {
                    this.totalArrecadadoMesPix = response;
                    this.loadingTotalMesPix = false;
                  },
                  error: (error) => {
                    console.error('Erro ao buscar PIX:', error);
                    this.loadingTotalMes = false;
                  },
                });
              this.subscriptions.add(alunoSub);
            }
          },
          error: (error) => {
            console.error('Erro ao buscar escola:', error);
          },
        });

      this.subscriptions.add(schoolSub);
    }
  }

  carregarProximosRepasses(carregarMais?: boolean): void {
    if (carregarMais) {
      this.limitPagementos += 3;
    } else {
      this.loadingTotalMes = true;
      this.limitPagementos = 6;
      this.mostarMenos = false;
    }

    const repasseSub = this.pagamentosService
      .getNextPayout(this.limitPagementos)
      .subscribe({
        next: (response) => {
          if (
            this.repasses.length > 6 &&
            this.repasses.length === response.payouts.length
          ) {
            this.mostarMenos = true;
          }
          this.repasses = response.payouts;
          this.totalArrecadadoMes = response.pendingBalance;
          this.loadingTotalMes = false;
        },
        error: (error) => {
          console.error('Erro ao buscar repasses:', error);
          this.loadingTotalMes = false;
        },
      });

    this.subscriptions.add(repasseSub);
  }

  onSubmit(): void {
    const createSub = this.schoolService.createSchool(this.school).subscribe({
      next: (response) => {
        console.log(response);
      },
    });

    this.subscriptions.add(createSub);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
