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

  // --- NOVAS PROPRIEDADES ---
  totalArrecadadoMes: number | null = null;
  loadingTotalMes: boolean = true;
  // --- FIM NOVAS PROPRIEDADES ---

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

            this.pagamentosService.getNextPayout().subscribe({
              next: (response) => {
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
        },
      });
    }
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
