import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { School } from '../interfaces/school.interface';
import { QueryParams } from '../interfaces/query.interface';
import { SchoolService } from '../core/services/school.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  jwtHelper = new JwtHelperService();
  noExistesSchool = true;
  errorMessage: string = '';
  school: School = {};
  alunoMenuOpen: boolean = false;
  pagamentoMenuOpen: boolean = false;
  token = localStorage.getItem('authToken');
  schoolName: string = 'Carregando...';
  isMobileMenuOpen: boolean = false;
  menuState: { [key: string]: boolean } = {
    alunos: false,
    pagamentos: false,
  };
  isSidebarClosed = false; // Estado inicial do menu lateral

  constructor(
    private schoolService: SchoolService,
    private router: Router,
    private renderer: Renderer2
  ) {}
  ngOnInit() {
    const token = localStorage.getItem('authToken');
    let decodedToken: any;
    if (token) {
      decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (decodedToken) {
      this.school.userId = decodedToken.sub;
      const query: QueryParams = {
        projection: { name: 1 },
      };
      this.schoolService.getSchoolById(decodedToken.sub, query).subscribe({
        next: (school: School) => {
          if (school) {
            this.noExistesSchool = false;
            this.school = school;
          }
        },
      });
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  toggleAlunoMenu(): void {
    this.alunoMenuOpen = !this.alunoMenuOpen;
  }

  togglePagamentoMenu(): void {
    this.pagamentoMenuOpen = !this.pagamentoMenuOpen;
  }

  toggleSidebar(): void {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      if (!this.isSidebarClosed) {
        this.renderer.addClass(document.body, 'no-scroll');
      } else {
        this.renderer.removeClass(document.body, 'no-scroll');
      }
    }
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  closeSidebarOnMobile(): void {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  closeSidebarOnMobileIfOpen(): void {
    if (this.isSidebarClosed) {
      this.isSidebarClosed = !this.isSidebarClosed;
      this.renderer.removeClass(document.body, 'no-scroll');
    }
  }
}
