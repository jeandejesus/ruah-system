// src/app/core/services/http-params.service.ts

import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpParamsService {
  toHttpParams(obj: Record<string, any>): HttpParams {
    let params = new HttpParams();

    Object.keys(obj).forEach((key) => {
      const value = obj[key];

      if (value === null || value === undefined) {
        return;
      }

      if (typeof value === 'object') {
        params = params.set(key, JSON.stringify(value));
      } else {
        params = params.set(key, String(value));
      }
    });

    return params;
  }
}
