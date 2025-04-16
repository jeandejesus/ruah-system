import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSchoolByUserId(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/school/${userId}`);
  }

  createSchool(schoolData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/schools`, schoolData);
  }

  updateSchool(id: string, schoolData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/schools/${id}`, schoolData);
  }

  deleteSchool(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/schools/${id}`);
  }

  getSchoolById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/schools/${id}`);
  }
}
