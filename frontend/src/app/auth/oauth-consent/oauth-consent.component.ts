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
            <span class="provider-icon">{{ getProviderIcon() }}</span>
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
      font-size: 18px;
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

  getProviderIcon(): string {
    switch (this.provider) {
      case 'github': return '🐈';
      case 'microsoft': return '🪟';
      default: return 'G';
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
