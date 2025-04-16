import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  getAlunos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAlunoById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createAluno(aluno: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-payment`, aluno);
  }

  updateAluno(aluno: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${aluno.id}`, aluno);
  }

  deleteAluno(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
