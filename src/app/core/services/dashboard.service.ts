import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { School } from 'src/app/interfaces/school.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  // A URL do backend para o login
  private apiUrl = 'http://localhost:3000/admin'; // Altere para a URL correta do seu backend
  school: School = {};

  constructor(private http: HttpClient) {}

  // Buscar a escola por ID
  getSchoolById(schoolId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/school?id=${schoolId}`, {
      headers,
    });
  }

  createSchool(school: School): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/schools`, school, {
      headers,
    });
  }
}
