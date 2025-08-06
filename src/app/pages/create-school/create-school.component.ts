import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SchoolService } from 'src/app/core/services/school.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { School } from 'src/app/interfaces/school.interface';

@Component({
  selector: 'app-create-school',
  templateUrl: './create-school.component.html',
  styleUrls: ['./create-school.component.scss'],
})
export class CreateSchoolComponent {
  school: School = {
    name: '',
    phone: '',
    email: '',
    userId: '',
    _id: '',
  };

  constructor(private schoolService: SchoolService, private router: Router) {
    const jwtHelper = new JwtHelperService();
    const token = localStorage.getItem('authToken');

    if (token) {
      const user = jwtHelper.decodeToken(token);
      if (user) {
        this.school.userId = user.sub;
      }
    }
  }

  onSubmit() {
    this.schoolService.createSchool(this.school).subscribe({
      next: (response: School) => {
        if (response._id) {
          localStorage.setItem('schoolId', response._id);
          this.router.navigate(['/painel']);
        }
      },
      error: (error) => {
        console.error('Error creating school:', error);
        // Handle error (show message to user)
      },
    });
  }
}
