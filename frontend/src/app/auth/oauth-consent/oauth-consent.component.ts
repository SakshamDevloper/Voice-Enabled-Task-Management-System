import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-oauth-consent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="consent-container" [class.popup-mode]="isPopup">
      
      <!-- GOOGLE PIPELINE -->
      <div class="google-card" *ngIf="provider === 'google'">
        <div class="google-header">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Sign in with Google</span>
        </div>
        
        <div class="google-body" *ngIf="currentStep === 1">
          <h1 class="google-title">Sign in</h1>
          <p class="google-subtitle">to continue to <span class="app-name">VoiceTask</span></p>
          
          <div class="google-input-group">
            <input type="text" [(ngModel)]="email" required placeholder=" " id="google-email" />
            <label for="google-email">Email or phone</label>
          </div>
          
          <a href="#" class="google-link" (click)="$event.preventDefault()">Forgot email?</a>
          
          <p class="google-terms">
            Before using this app, you can review VoiceTask's <a href="#" (click)="$event.preventDefault()">Privacy Policy</a> and <a href="#" (click)="$event.preventDefault()">Terms of Service</a>.
          </p>
          
          <div class="google-actions">
            <button class="btn-google-text" (click)="cancel()">Cancel</button>
            <button class="btn-google-primary" [disabled]="!email" (click)="googleNext()">Next</button>
          </div>
        </div>
        
        <div class="google-body" *ngIf="currentStep === 2">
          <h1 class="google-title">Welcome</h1>
          <p class="google-user-display">👤 {{ email }}</p>
          
          <div class="google-input-group">
            <input type="text" [(ngModel)]="fullName" required placeholder=" " id="google-name" />
            <label for="google-name">Enter your Full Name</label>
          </div>
          
          <div class="google-actions">
            <button class="btn-google-text" (click)="currentStep = 1">Back</button>
            <button class="btn-google-primary" [disabled]="!fullName" (click)="authorize()">Sign In</button>
          </div>
        </div>
      </div>

      <!-- GITHUB PIPELINE -->
      <div class="github-card" *ngIf="provider === 'github'">
        <div class="github-header">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <h1 class="github-title">Sign in to GitHub</h1>
          <p class="github-subtitle">to continue to <span class="app-name">VoiceTask</span></p>
        </div>
        
        <div class="github-body">
          <div class="github-form-group">
            <label for="github-login">Username or email address</label>
            <input type="text" [(ngModel)]="email" id="github-login" />
          </div>

          <div class="github-form-group">
            <label for="github-name">Full Name</label>
            <input type="text" [(ngModel)]="fullName" id="github-name" placeholder="e.g. Saksham Sethi" />
          </div>
          
          <div class="github-form-group">
            <div class="label-row">
              <label for="github-password">Password</label>
              <a href="#" class="github-link" (click)="$event.preventDefault()">Forgot password?</a>
            </div>
            <input type="password" [(ngModel)]="password" id="github-password" />
          </div>
          
          <button class="btn-github-primary" [disabled]="!email || !fullName" (click)="githubSignIn()">
            Sign in
          </button>
          
          <div class="github-footer">
            <button class="btn-github-text" (click)="cancel()">Cancel and return</button>
          </div>
        </div>
      </div>

      <!-- MICROSOFT PIPELINE -->
      <div class="ms-card" *ngIf="provider === 'microsoft'">
        <div class="ms-header">
          <svg width="36" height="36" viewBox="0 0 24 24">
            <rect x="0" y="0" width="11" height="11" fill="#F25022"/>
            <rect x="13" y="0" width="11" height="11" fill="#7FBA00"/>
            <rect x="0" y="13" width="11" height="11" fill="#00A4EF"/>
            <rect x="13" y="13" width="11" height="11" fill="#FFB900"/>
          </svg>
          <span class="ms-brand-name">Microsoft</span>
        </div>
        
        <div class="ms-body" *ngIf="currentStep === 1">
          <h1 class="ms-title">Sign in</h1>
          <p class="ms-subtitle">to continue to <span class="app-name">VoiceTask</span></p>
          
          <div class="ms-form-group">
            <input type="text" [(ngModel)]="email" placeholder="Email, phone, or Skype" id="ms-email" />
          </div>
          
          <p class="ms-text-sm">No account? <a href="#" (click)="$event.preventDefault()">Create one!</a></p>
          <p class="ms-text-sm"><a href="#" (click)="$event.preventDefault()">Can't access your account?</a></p>
          
          <div class="ms-actions">
            <button class="btn-ms-secondary" (click)="cancel()">Cancel</button>
            <button class="btn-ms-primary" [disabled]="!email" (click)="msNext()">Next</button>
          </div>
        </div>
        
        <div class="ms-body" *ngIf="currentStep === 2">
          <h1 class="ms-title">Enter details</h1>
          <p class="ms-user-display">👤 {{ email }}</p>
          
          <div class="ms-form-group">
            <input type="text" [(ngModel)]="fullName" placeholder="Full Name" id="ms-name" />
          </div>
          
          <div class="ms-actions">
            <button class="btn-ms-secondary" (click)="currentStep = 1">Back</button>
            <button class="btn-ms-primary" [disabled]="!fullName" (click)="authorize()">Sign in</button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    /* Reset & Container */
    .consent-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 16px;
      box-sizing: border-box;
    }
    .consent-container.popup-mode {
      background: #ffffff;
      padding: 0;
    }

    /* GOOGLE STYLE */
    .google-card {
      background: #ffffff;
      width: 450px;
      max-width: 100%;
      border-radius: 8px;
      border: 1px solid #dadce0;
      padding: 36px 40px;
      box-sizing: border-box;
      min-height: 500px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .consent-container.popup-mode .google-card {
      border: none;
      width: 100%;
      height: 100%;
      min-height: 100vh;
      border-radius: 0;
      padding: 24px;
    }
    .google-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
    }
    .google-header span {
      font-size: 14px;
      font-weight: 500;
      color: #3c4043;
    }
    .google-title {
      font-size: 24px;
      font-weight: 400;
      color: #202124;
      margin: 0 0 8px;
    }
    .google-subtitle {
      font-size: 16px;
      color: #202124;
      margin: 0 0 28px;
    }
    .google-user-display {
      background: #f1f3f4;
      padding: 8px 12px;
      border-radius: 20px;
      display: inline-block;
      font-size: 14px;
      color: #3c4043;
      margin-bottom: 20px;
    }
    .google-input-group {
      position: relative;
      margin-bottom: 20px;
      width: 100%;
    }
    .google-input-group input {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #dadce0;
      border-radius: 4px;
      padding: 16px 14px;
      font-size: 16px;
      color: #202124;
      outline: none;
      transition: border-color 0.2s;
    }
    .google-input-group input:focus {
      border-color: #1a73e8;
      border-width: 2px;
      padding: 15px 13px;
    }
    .google-input-group label {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      background: #ffffff;
      padding: 0 4px;
      color: #5f6368;
      font-size: 16px;
      pointer-events: none;
      transition: transform 0.2s, font-size 0.2s, color 0.2s;
    }
    .google-input-group input:focus ~ label,
    .google-input-group input:not(:placeholder-shown) ~ label {
      transform: translateY(-36px);
      font-size: 12px;
      color: #1a73e8;
    }
    .google-link {
      color: #1a73e8;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      display: inline-block;
      margin-bottom: 32px;
    }
    .google-link:hover {
      text-decoration: underline;
    }
    .google-terms {
      font-size: 14px;
      color: #5f6368;
      line-height: 1.4;
      margin-bottom: 32px;
    }
    .google-terms a {
      color: #1a73e8;
      text-decoration: none;
    }
    .google-terms a:hover {
      text-decoration: underline;
    }
    .google-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    }
    .btn-google-text {
      background: none;
      border: none;
      color: #1a73e8;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 4px;
    }
    .btn-google-text:hover {
      background: rgba(26, 115, 232, 0.04);
    }
    .btn-google-primary {
      background: #1a73e8;
      border: none;
      color: #ffffff;
      font-size: 14px;
      font-weight: 500;
      padding: 10px 24px;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-google-primary:hover {
      background: #1557b0;
    }
    .btn-google-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    /* GITHUB STYLE */
    .github-card {
      background: #ffffff;
      width: 340px;
      max-width: 100%;
      border-radius: 6px;
      border: 1px solid #d8dee4;
      padding: 24px;
      box-sizing: border-box;
    }
    .consent-container.popup-mode .github-card {
      border: none;
      width: 100%;
      height: 100%;
      min-height: 100vh;
      border-radius: 0;
      padding: 16px;
    }
    .github-header {
      text-align: center;
      margin-bottom: 16px;
    }
    .github-header svg {
      color: #24292e;
      margin-bottom: 16px;
    }
    .github-title {
      font-size: 24px;
      font-weight: 300;
      color: #24292f;
      margin: 0 0 4px;
    }
    .github-subtitle {
      font-size: 14px;
      color: #57606a;
      margin: 0;
    }
    .github-body {
      background: #f6f8fa;
      border: 1px solid #d0d7de;
      border-radius: 6px;
      padding: 16px;
    }
    .consent-container.popup-mode .github-body {
      background: #ffffff;
      border: none;
      padding: 0;
    }
    .github-form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;
    }
    .github-form-group label {
      font-size: 14px;
      color: #24292f;
      margin-bottom: 8px;
      font-weight: 400;
    }
    .github-form-group .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .github-form-group input {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #d0d7de;
      border-radius: 6px;
      padding: 5px 12px;
      font-size: 14px;
      color: #24292f;
      background: #ffffff;
      outline: none;
    }
    .github-form-group input:focus {
      border-color: #0969da;
      box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.3);
    }
    .github-link {
      color: #0969da;
      font-size: 12px;
      text-decoration: none;
    }
    .github-link:hover {
      text-decoration: underline;
    }
    .btn-github-primary {
      width: 100%;
      background: #2da44e;
      border: 1px solid rgba(27, 31, 36, 0.15);
      border-radius: 6px;
      color: #ffffff;
      font-size: 14px;
      font-weight: 600;
      padding: 6px 16px;
      cursor: pointer;
      text-align: center;
    }
    .btn-github-primary:hover {
      background: #2c974b;
    }
    .btn-github-primary:disabled {
      background: #94d3a2;
      cursor: not-allowed;
    }
    .github-footer {
      text-align: center;
      margin-top: 16px;
    }
    .btn-github-text {
      background: none;
      border: none;
      color: #0969da;
      font-size: 12px;
      cursor: pointer;
    }
    .btn-github-text:hover {
      text-decoration: underline;
    }

    /* MICROSOFT STYLE */
    .ms-card {
      background: #ffffff;
      width: 440px;
      max-width: 100%;
      border-radius: 0;
      border: 1px solid #d2d2d2;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      padding: 44px;
      box-sizing: border-box;
      min-height: 380px;
    }
    .consent-container.popup-mode .ms-card {
      border: none;
      box-shadow: none;
      width: 100%;
      height: 100%;
      min-height: 100vh;
      padding: 24px;
    }
    .ms-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }
    .ms-brand-name {
      font-size: 18px;
      font-weight: 600;
      color: #737373;
    }
    .ms-title {
      font-size: 24px;
      font-weight: 600;
      color: #1b1b1b;
      margin: 0 0 4px;
    }
    .ms-subtitle {
      font-size: 15px;
      color: #1b1b1b;
      margin: 0 0 20px;
    }
    .ms-user-display {
      font-size: 15px;
      color: #1b1b1b;
      margin-bottom: 20px;
    }
    .ms-form-group {
      margin-bottom: 20px;
    }
    .ms-form-group input {
      width: 100%;
      box-sizing: border-box;
      border: none;
      border-bottom: 1px solid #666666;
      padding: 6px 0;
      font-size: 15px;
      color: #1b1b1b;
      outline: none;
    }
    .ms-form-group input:focus {
      border-bottom: 2px solid #0067b8;
    }
    .ms-text-sm {
      font-size: 13px;
      color: #1b1b1b;
      margin: 0 0 12px;
    }
    .ms-text-sm a {
      color: #0067b8;
      text-decoration: none;
    }
    .ms-text-sm a:hover {
      text-decoration: underline;
    }
    .ms-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 36px;
    }
    .btn-ms-secondary {
      background: #cccccc;
      border: none;
      color: #1b1b1b;
      font-size: 15px;
      padding: 6px 12px;
      min-width: 90px;
      cursor: pointer;
    }
    .btn-ms-secondary:hover {
      background: #b3b3b3;
    }
    .btn-ms-primary {
      background: #0067b8;
      border: none;
      color: #ffffff;
      font-size: 15px;
      padding: 6px 12px;
      min-width: 90px;
      cursor: pointer;
    }
    .btn-ms-primary:hover {
      background: #005da6;
    }
    .btn-ms-primary:disabled {
      background: #cccccc;
      color: #ffffff;
      cursor: not-allowed;
    }

    .app-name {
      font-weight: 600;
    }
  `]
})
export class OAuthConsentComponent implements OnInit {
  provider = 'google';
  fullName = '';
  email = '';
  password = '';
  isPopup = false;
  currentStep = 1;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.provider = params['provider'] || 'google';
      this.isPopup = params['popup'] === 'true';
    });
  }

  getProviderName(): string {
    switch (this.provider) {
      case 'github': return 'GitHub';
      case 'microsoft': return 'Microsoft';
      default: return 'Google';
    }
  }

  googleNext(): void {
    if (this.email) {
      this.currentStep = 2;
    }
  }

  msNext(): void {
    if (this.email) {
      this.currentStep = 2;
    }
  }

  githubSignIn(): void {
    this.authorize();
  }

  authorize(): void {
    if (!this.email) return;
    
    // Default fullname to email prefix if not provided
    const finalName = this.fullName || this.email.split('@')[0];
    
    if (this.isPopup) {
      if (window.opener) {
        window.opener.postMessage({
          type: 'oauth-success',
          provider: this.provider,
          code: `auth_code_${Date.now()}`,
          email: this.email,
          name: finalName
        }, window.location.origin);
      }
      window.close();
    } else {
      this.router.navigate(['/login'], {
        queryParams: {
          provider: this.provider,
          code: `auth_code_${Date.now()}`,
          email: this.email,
          name: finalName
        }
      });
    }
  }

  cancel(): void {
    if (this.isPopup) {
      if (window.opener) {
        window.opener.postMessage({ type: 'oauth-cancel' }, window.location.origin);
      }
      window.close();
    } else {
      this.router.navigate(['/login']);
    }
  }
}
