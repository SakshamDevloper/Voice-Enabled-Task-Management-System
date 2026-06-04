import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, timeout, retry, BehaviorSubject } from 'rxjs';

interface AuthResponse {
  token: string;
  user: { id: string; email: string; firstName: string; avatar?: string; provider?: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:5000/api/auth';
  private tokenRefreshTimer: any;
  private authStateSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.setupTokenRefresh();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, { email, password })
      .pipe(
        timeout(8000), // 8 second timeout
        retry({ count: 1, delay: 500 }), // Retry once after 500ms
        tap(res => this.handleAuthSuccess(res)),
        catchError(err => {
          console.error('Login error:', err);
          throw err;
        })
      );
  }

  sendOTP(phone: string): Observable<any> {
    return this.http.post<any>(`${this.api}/send-otp`, { phone })
      .pipe(
        timeout(8000),
        catchError(err => {
          console.error('Send OTP error:', err);
          throw err;
        })
      );
  }

  verifyOTP(phone: string, otp: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/verify-otp`, { phone, otp })
      .pipe(
        timeout(8000),
        tap(res => this.handleAuthSuccess(res)),
        catchError(err => {
          console.error('Verify OTP error:', err);
          throw err;
        })
      );
  }

  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/register`, data)
      .pipe(
        timeout(8000),
        retry({ count: 1, delay: 500 }),
        tap(res => this.handleAuthSuccess(res)),
        catchError(err => {
          console.error('Register error:', err);
          throw err;
        })
      );
  }

  oauthLogin(provider: 'github' | 'microsoft' | 'google'): Observable<AuthResponse> {
    // Simulate OAuth flow with reduced latency
    const mockUser = {
      provider,
      providerId: `${provider}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: `user_${Date.now()}@${provider}.com`,
      firstName: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      lastName: 'Account',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}_${Date.now()}`
    };
    
    // Simulate OAuth server response with minimal delay (50ms)
    return new Observable(observer => {
      const timeoutId = setTimeout(() => {
        this.http.post<AuthResponse>(`${this.api}/oauth`, mockUser)
          .pipe(
            timeout(7000),
            retry({ count: 1, delay: 300 }),
            tap(res => {
              observer.next(res);
              this.handleAuthSuccess(res);
              observer.complete();
            }),
            catchError(err => {
              observer.error(err);
              throw err;
            })
          )
          .subscribe();
      }, 50); // Minimal delay before OAuth call
      
      return () => clearTimeout(timeoutId);
    });
  }

  private handleAuthSuccess(res: AuthResponse): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    localStorage.setItem('loginTime', Date.now().toString());
    this.authStateSubject.next(true);
    this.setupTokenRefresh();
  }

  private setupTokenRefresh(): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
    }

    // Refresh token 30 seconds before expiry (7 days = 604800s, refresh at 604770s = 7 days - 30s)
    const tokenAge = Date.now() - parseInt(localStorage.getItem('loginTime') || '0');
    const refreshIn = (604770 * 1000) - tokenAge;

    if (refreshIn > 0) {
      this.tokenRefreshTimer = setTimeout(() => {
        this.refreshToken().subscribe();
      }, Math.max(refreshIn, 1000));
    }
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/refresh-token`, {})
      .pipe(
        timeout(5000),
        tap(res => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('loginTime', Date.now().toString());
          this.setupTokenRefresh();
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
    }
    this.authStateSubject.next(false);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    // Check token expiry
    const loginTime = parseInt(localStorage.getItem('loginTime') || '0');
    const tokenAge = Date.now() - loginTime;
    const tokenDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

    if (tokenAge > tokenDuration) {
      this.logout();
      return false;
    }

    return true;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  getAuthState(): Observable<boolean> {
    return this.authState$;
  }

  oauthLoginSecure(provider: string, code: string, email: string, name: string): Observable<AuthResponse> {
    const mockUser = {
      provider,
      providerId: `${provider}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      firstName: name.split(' ')[0] || 'User',
      lastName: name.split(' ').slice(1).join(' ') || 'Account',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}_${Date.now()}`
    };

    return this.http.post<AuthResponse>(`${this.api}/oauth`, mockUser)
      .pipe(
        tap(res => this.handleAuthSuccess(res))
      );
  }

  updateProfile(data: any): Observable<any> {
    const token = this.getToken();
    return this.http.put(`${this.api}/profile`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap((res: any) => {
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }
}