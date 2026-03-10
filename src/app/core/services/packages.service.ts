import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PackagePlan } from '../../shared/packages.constants';

@Injectable({ providedIn: 'root' })
export class PackagesService {
  private api = `${environment.apiUrl}/packages`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PackagePlan[]> {
    return this.http.get<PackagePlan[]>(this.api);
  }

  create(pkg: Omit<PackagePlan, '_id'>): Observable<PackagePlan> {
    return this.http.post<PackagePlan>(this.api, pkg);
  }

  update(id: string, pkg: Partial<PackagePlan>): Observable<PackagePlan> {
    return this.http.put<PackagePlan>(`${this.api}/${id}`, pkg);
  }

  delete(id: string): Observable<PackagePlan> {
    return this.http.delete<PackagePlan>(`${this.api}/${id}`);
  }
}
