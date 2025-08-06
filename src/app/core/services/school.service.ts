import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QueryParams } from 'src/app/interfaces/query.interface';
import { School } from 'src/app/interfaces/school.interface';
import { HttpParamsService } from './http-params.service';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(
    private http: HttpClient,
    private httpParamsService: HttpParamsService // injetando o serviço
  ) {}

  // 🔁 Método reutilizável para headers com token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getSchoolById(schoolId: string, query: QueryParams = {}): Observable<School> {
    const params = this.httpParamsService.toHttpParams(query);

    return this.http.get<School>(`${this.apiUrl}/school/${schoolId}`, {
      headers: this.getAuthHeaders(),
      params,
    });
  }

  // ✅ Criar uma escola
  createSchool(school: School): Observable<School> {
    return this.http.post<School>(`${this.apiUrl}/schools`, school, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Buscar todas as escolas com suporte a filtros
  getAllSchools(query: QueryParams = {}): Observable<School[]> {
    const params = this.httpParamsService.toHttpParams(query);

    return this.http.get<School[]>(`${this.apiUrl}/schools`, {
      headers: this.getAuthHeaders(),
      params,
    });
  }
}
