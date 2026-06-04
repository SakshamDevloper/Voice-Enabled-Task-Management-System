import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
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
  otpSent = false;
  otpCode = '';
  serverOtp = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
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
      return;
    }

    // Check for returning OAuth parameters from the consent screen
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const provider = params['provider'];
      const code = params['code'];
      const email = params['email'];
      const name = params['name'];

      if (provider && code && email) {
        this.authLoading[provider] = true;
        this.authService.oauthLoginSecure(provider, code, email, name || 'OAuth User')
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.authLoading[provider] = false;
              this.router.navigate(['/tasks']);
            },
            error: (err: any) => {
              this.authLoading[provider] = false;
              this.error = `${provider} authorization failed. Please try again.`;
              console.error(`${provider} login error:`, err);
            }
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.loginMode === 'email' && this.form.invalid) return;
    if (this.loginMode === 'phone' && !this.otpSent && this.form.invalid) return;

    this.loading = true;
    this.error = '';
    
    if (this.loginMode === 'email') {
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
    } else {
      const { phone } = this.form.value;
      if (!this.otpSent) {
        this.authService.sendOTP(phone)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res: any) => {
              this.loading = false;
              this.otpSent = true;
              this.serverOtp = res.otp || '';
            },
            error: (err: any) => {
              this.error = err?.error?.message || 'Failed to send OTP. Please check the phone number.';
              this.loading = false;
              console.error('Send OTP error:', err);
            }
          });
      } else {
        if (!this.otpCode) {
          this.error = 'Please enter the verification code.';
          this.loading = false;
          return;
        }
        this.authService.verifyOTP(phone, this.otpCode)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loading = false;
              this.router.navigate(['/tasks']);
            },
            error: (err: any) => {
              this.error = err?.error?.message || 'Invalid OTP code. Please try again.';
              this.loading = false;
              console.error('Verify OTP error:', err);
            }
          });
      }
    }
  }

  switchMode(mode: 'email' | 'phone'): void {
    this.loginMode = mode;
    this.form.reset();
    this.error = '';
    this.otpSent = false;
    this.otpCode = '';
    this.serverOtp = '';
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
    this.error = '';
    const width = 500;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const popupUrl = `/oauth-consent?provider=${provider}&popup=true`;
    
    const popup = window.open(
      popupUrl,
      'OAuthConsentPopup',
      `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes,scrollbars=yes`
    );

    if (!popup) {
      this.error = 'Pop-up window blocked. Please allow pop-ups for this site.';
      return;
    }

    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'oauth-success') {
        const { provider: resProvider, code, email, name } = event.data;
        this.authLoading[resProvider] = true;
        this.authService.oauthLoginSecure(resProvider, code, email, name)
          .subscribe({
            next: () => {
              this.authLoading[resProvider] = false;
              this.router.navigate(['/tasks']);
              window.removeEventListener('message', messageListener);
            },
            error: (err: any) => {
              this.authLoading[resProvider] = false;
              this.error = `${resProvider} authorization failed. Please try again.`;
              console.error(`${resProvider} login error:`, err);
              window.removeEventListener('message', messageListener);
            }
          });
      } else if (event.data?.type === 'oauth-cancel') {
        window.removeEventListener('message', messageListener);
      }
    };

    window.addEventListener('message', messageListener);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getPasswordFieldType(): string {
    return this.showPassword ? 'text' : 'password';
  }
}