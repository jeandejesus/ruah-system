import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DashboardService } from '../core/services/dashboard.service';
import { School } from '../interfaces/school.interface';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  jwtHelper = new JwtHelperService();
  noExistesSchool = true;
  errorMessage: string = '';
  school: School = {};
  alunoMenuOpen: boolean = false;
  pagamentoMenuOpen: boolean = false;
  token = localStorage.getItem('authToken');

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}
  ngOnInit() {
    const token = localStorage.getItem('authToken');
    let decodedToken: any;
    if (token) {
      decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (decodedToken) {
      this.school.userId = decodedToken.sub;
      this.dashboardService.getSchoolById(decodedToken.sub).subscribe({
        next: (school) => {
          if (school) {
            this.noExistesSchool = false;
            this.school = school;
          }
        },
      });
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  toggleAlunoMenu() {
    this.alunoMenuOpen = !this.alunoMenuOpen;
  }

  togglePagamentoMenu() {
    this.pagamentoMenuOpen = !this.pagamentoMenuOpen;
  }
}
