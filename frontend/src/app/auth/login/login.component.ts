import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  showPassword = false;
  loading = false;
  authLoading: { [key: string]: boolean } = { github: false, microsoft: false, google: false };
  error = '';
  loginMode: 'email' | 'phone' = 'email';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Check if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tasks']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { email, password } = this.form.value;
    
    this.authService.login(email, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/tasks']);
        },
        error: (err: any) => {
          this.error = err?.error?.message || 'Invalid credentials. Please try again.';
          this.loading = false;
          console.error('Login error:', err);
        }
      });
  }

  switchMode(mode: 'email' | 'phone'): void {
    this.loginMode = mode;
    this.form.reset();
    this.error = '';
    if (mode === 'email') {
      this.form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    } else {
      this.form = this.fb.group({
        phone: ['', [Validators.required, Validators.pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)]]
      });
    }
  }

  loginWithProvider(provider: 'github' | 'microsoft' | 'google'): void {
    this.authLoading[provider] = true;
    this.error = '';
    
    this.authService.oauthLogin(provider)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.authLoading[provider] = false;
          this.router.navigate(['/tasks']);
        },
        error: (err: any) => {
          this.authLoading[provider] = false;
          this.error = `${provider} login failed. Please try again or use email/phone.`;
          console.error(`${provider} login error:`, err);
        }
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getPasswordFieldType(): string {
    return this.showPassword ? 'text' : 'password';
  }
}