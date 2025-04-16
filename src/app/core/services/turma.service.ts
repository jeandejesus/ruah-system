import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TurmaService {
  // URL do backend onde as turmas são manipuladas
  private baseUrl = `${environment.apiUrl}/turmas`;

  constructor(private http: HttpClient) {}

  // Método para criar uma nova turma
  criarTurma(turma: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, turma);
  }

  // Método para buscar uma turma pelo ID
  getTurmaById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Método para atualizar uma turma existente
  atualizarTurma(id: string, turma: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, turma);
  }

  // Método para buscar todas as turmas
  getTurmas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  // Método para deletar uma turma
  deletarTurma(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
