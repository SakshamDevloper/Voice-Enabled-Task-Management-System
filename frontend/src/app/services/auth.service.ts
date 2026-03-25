import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  token: string;
  user: { id: string; email: string; firstName: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, { email, password })
      .pipe(tap(res => localStorage.setItem('token', res.token)));
  }

  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/register`, data)
      .pipe(tap(res => localStorage.setItem('token', res.token)));
  }

  logout(): void { localStorage.removeItem('token'); }

  isLoggedIn(): boolean { return !!localStorage.getItem('token'); }

  getToken(): string | null { return localStorage.getItem('token'); }
}