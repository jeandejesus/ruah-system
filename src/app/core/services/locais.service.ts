import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Local {
  _id?: string;
  name: string;
  address: string;
}

@Injectable({
  providedIn: 'root',
})
export class LocaisService {
  private apiUrl = `${environment.apiUrl}/locals`;

  constructor(private http: HttpClient) {}

  getLocais(): Observable<Local[]> {
    return this.http.get<Local[]>(this.apiUrl);
  }

  createLocal(local: Local): Observable<Local> {
    return this.http.post<Local>(this.apiUrl, local);
  }

  updateLocal(id: string, local: Local): Observable<Local> {
    return this.http.put<Local>(`${this.apiUrl}/${id}`, local);
  }

  deleteLocal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
