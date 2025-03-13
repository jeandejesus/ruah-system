import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { School } from 'src/app/interfaces/school.interface';

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

  constructor(private dashboardService: DashboardService) {}
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

  onSubmit() {
    this.dashboardService.createSchool(this.school).subscribe({
      next: (response) => {
        console.log(response);
      },
    });
  }
}
