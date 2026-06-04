import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, tap, timeout } from 'rxjs/operators';

export interface CacheEntry {
  response: HttpResponse<any>;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class CacheService {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  get(key: string): HttpResponse<any> | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const isExpired = Date.now() - entry.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.response;
  }

  set(key: string, response: HttpResponse<any>): void {
    this.cache.set(key, { response, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }

  clearByPattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

export const performanceInterceptor: HttpInterceptorFn = (req, next) => {
  // Determine timeout based on endpoint type
  const isAuthEndpoint = req.url.includes('/auth/') || req.url.includes('/oauth');
  const timeout_ms = isAuthEndpoint ? 8000 : 10000; // Auth: 8s, Others: 10s
  
  // Skip caching for non-GET and auth requests
  if (req.method !== 'GET') {
    return next(req).pipe(
      timeout(timeout_ms),
      retry({ 
        count: 1, 
        delay: () => {
          // Faster retry: 300ms
          return new Promise<void>(resolve => 
            setTimeout(() => resolve(), 300)
          );
        }
      }),
      catchError(err => {
        console.error('HTTP Error:', err);
        return throwError(() => ({
          message: 'Request failed. Please try again.',
          originalError: err
        }));
      })
    );
  }

  // For GET requests, use caching
  const cacheService = new CacheService();
  const cachedResponse = cacheService.get(req.url);
  
  if (cachedResponse) {
    return of(cachedResponse);
  }

  return next(req).pipe(
    timeout(timeout_ms),
    retry({ 
      count: 1, 
      delay: () => {
        return new Promise<void>(resolve => 
          setTimeout(() => resolve(), 300)
        );
      }
    }),
    tap(event => {
      if (event instanceof HttpResponse) {
        cacheService.set(req.url, event);
      }
    }),
    catchError(err => {
      console.error('HTTP Error:', err);
      return throwError(() => ({
        message: 'Network error. Please check your connection.',
        originalError: err
      }));
    })
  );
};
