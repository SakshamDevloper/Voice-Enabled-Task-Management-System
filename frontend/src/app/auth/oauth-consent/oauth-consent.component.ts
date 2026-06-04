import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-oauth-consent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="consent-container">
      <div class="consent-card">
        <!-- Brand / Logo Header -->
        <div class="consent-header">
          <div class="app-logo">🎙️</div>
          <h2>VoiceTask Request</h2>
          <p class="subtitle">wants to access your account</p>
        </div>

        <hr class="divider" />

        <!-- Provider Specific Info -->
        <div class="provider-info">
          <div class="provider-badge" [ngClass]="provider">
            <span class="provider-icon" [ngSwitch]="provider">
              <svg *ngSwitchCase="'github'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <svg *ngSwitchCase="'microsoft'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="0" y="0" width="10" height="10" fill="#F25022"/>
                <rect x="12" y="0" width="10" height="10" fill="#7FBA00"/>
                <rect x="0" y="12" width="10" height="10" fill="#00A4EF"/>
                <rect x="12" y="12" width="10" height="10" fill="#FFB900"/>
              </svg>
              <svg *ngSwitchCase="'google'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </span>
            <span class="provider-name">{{ getProviderName() }}</span>
          </div>
        </div>

        <!-- Permissions List -->
        <div class="permissions-section">
          <p class="permissions-title">VoiceTask will receive:</p>
          <ul class="permissions-list">
            <li>
              <span class="bullet">✓</span>
              <div>
                <strong>Your primary email address</strong>
                <span>Used for sending task notifications and alerts</span>
              </div>
            </li>
            <li>
              <span class="bullet">✓</span>
              <div>
                <strong>Your public profile info</strong>
                <span>Your name, username, and profile picture</span>
              </div>
            </li>
          </ul>
        </div>

        <hr class="divider" />

        <!-- Account Chooser Form -->
        <div class="account-selection">
          <label>Link with Account Identity:</label>
          <div class="input-group">
            <span class="input-icon">👤</span>
            <input type="text" [(ngModel)]="fullName" placeholder="Full Name (e.g. Saksham Sethi)" />
          </div>
          <div class="input-group">
            <span class="input-icon">✉️</span>
            <input type="email" [(ngModel)]="email" placeholder="Email Address (e.g. user@domain.com)" />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="consent-actions">
          <button class="btn-cancel" (click)="cancel()">Cancel</button>
          <button class="btn-authorize" [ngClass]="provider" [disabled]="!fullName || !email" (click)="authorize()">
            Authorize VoiceTask
          </button>
        </div>

        <div class="consent-footer">
          <p>By authorizing, you allow VoiceTask to link your credentials securely with our platform.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .consent-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #f1f5f9;
      font-family: 'Inter', sans-serif;
      padding: 16px;
    }
    .consent-card {
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05), 0 2px 10px rgba(0, 0, 0, 0.02);
      width: 440px;
      max-width: 100%;
      padding: 32px;
      border: 1px solid #e2e8f0;
    }
    .consent-header {
      text-align: center;
    }
    .app-logo {
      font-size: 40px;
      margin-bottom: 12px;
    }
    .consent-header h2 {
      margin: 0;
      color: #0f172a;
      font-size: 20px;
      font-weight: 700;
    }
    .subtitle {
      margin: 4px 0 0;
      color: #64748b;
      font-size: 14px;
    }
    .divider {
      border: 0;
      border-top: 1px solid #e2e8f0;
      margin: 20px 0;
    }
    .provider-info {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
    .provider-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 18px;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 14px;
    }
    .provider-badge.google {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fee2e2;
    }
    .provider-badge.github {
      background: #f8fafc;
      color: #0f172a;
      border: 1px solid #e2e8f0;
    }
    .provider-badge.microsoft {
      background: #eff6ff;
      color: #2563eb;
      border: 1px solid #dbeafe;
    }
    .provider-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .provider-icon svg {
      display: block;
    }
    .permissions-section {
      margin-bottom: 20px;
    }
    .permissions-title {
      font-weight: 600;
      color: #334155;
      font-size: 14px;
      margin-bottom: 12px;
    }
    .permissions-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .permissions-list li {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
      font-size: 13px;
    }
    .bullet {
      color: #10b981;
      font-weight: bold;
    }
    .permissions-list li strong {
      display: block;
      color: #0f172a;
    }
    .permissions-list li span {
      color: #64748b;
    }
    .account-selection {
      margin-bottom: 24px;
    }
    .account-selection label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 8px;
    }
    .input-group {
      position: relative;
      margin-bottom: 10px;
    }
    .input-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      color: #94a3b8;
    }
    .input-group input {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 12px 10px 38px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      outline: none;
      font-size: 14px;
      color: #0f172a;
      transition: border-color 0.2s;
    }
    .input-group input:focus {
      border-color: #2563eb;
    }
    .consent-actions {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }
    .btn-cancel {
      flex: 1;
      padding: 11px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      border-radius: 8px;
      color: #475569;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-authorize {
      flex: 2;
      padding: 11px;
      border: none;
      border-radius: 8px;
      color: #ffffff;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn-authorize:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .btn-authorize.google {
      background: #ea4335;
    }
    .btn-authorize.github {
      background: #24292e;
    }
    .btn-authorize.microsoft {
      background: #00a4ef;
    }
    .consent-footer {
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      line-height: 1.4;
    }
  `]
})
export class OAuthConsentComponent implements OnInit {
  provider = 'google';
  fullName = '';
  email = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.provider = params['provider'] || 'google';
    });
  }

  getProviderName(): string {
    switch (this.provider) {
      case 'github': return 'GitHub';
      case 'microsoft': return 'Microsoft';
      default: return 'Google';
    }
  }



  authorize(): void {
    if (!this.fullName || !this.email) return;
    
    this.router.navigate(['/login'], {
      queryParams: {
        provider: this.provider,
        code: `auth_code_${Date.now()}`,
        email: this.email,
        name: this.fullName
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/login']);
  }
}
