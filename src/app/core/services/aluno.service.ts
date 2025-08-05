import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  getAlunos(page: number, limit: number, term?: string): Observable<any[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (term && term.trim() !== '') {
      params = params.set('term', term.trim());
    }

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getAlunoById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createAluno(aluno: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, aluno);
  }

  updateAluno(aluno: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${aluno._id}`, aluno);
  }

  deleteAluno(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getAlunosPix(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pix`);
  }

  marcarPagamento(alunoId: string, month: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/mark-payment/${alunoId}?month=${month}`,
      {}
    );
  }
}
