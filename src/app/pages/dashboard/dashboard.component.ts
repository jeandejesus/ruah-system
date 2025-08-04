import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { School } from 'src/app/interfaces/school.interface';
import { PagamentosService } from '../pagamentos/pagamentos.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  jwtHelper = new JwtHelperService();
  noExistesSchool = true;
  errorMessage: string = '';
  school: School = {};
  repasses: any[] = [];
  totalArrecadadoMes: number | null = null;
  loadingTotalMes: boolean = true;
  limitPagementos = 6;
  mostarMenos = false;

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private pagamentosService: PagamentosService
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

      this.dashboardService.getSchoolById(decodedToken.sub).subscribe({
        next: (school) => {
          if (school) {
            this.noExistesSchool = false;
            this.school = school;
            this.carregarProximosRepasses();
          }
        },
      });
    }
  }

  carregarProximosRepasses(carregarMais?: boolean) {
    if (carregarMais) {
      this.limitPagementos = this.limitPagementos + 3;
    } else {
      this.loadingTotalMes = true;

      this.limitPagementos = 6;
      this.mostarMenos = false;
    }
    this.pagamentosService.getNextPayout(this.limitPagementos).subscribe({
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
        console.error('Erro ao buscar próximos repasses:', error);
        this.loadingTotalMes = false;
      },
    });
  }

  onSubmit() {
    this.dashboardService.createSchool(this.school).subscribe({
      next: (response) => {
        console.log(response);
      },
    });
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
