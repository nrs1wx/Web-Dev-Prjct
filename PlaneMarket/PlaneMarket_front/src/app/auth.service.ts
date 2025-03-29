import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();


  constructor(private api: ApiService) {
    const token = this.getAccessToken();
    if (token) {
      this.api.getCurrentUser().subscribe({
        next: (user) => this.currentUserSubject.next(user.username),
        error: () => { /* Removed logout here */ },
      });
    }
  }

  public initCurrentUser(): void {
    const token = this.getAccessToken();
    if (token && !this.currentUserSubject.value) {
      this.api.getCurrentUser().subscribe({
        next: (user) => this.currentUserSubject.next(user.username),
        error: () => {}, // Optional: handle errors
      });
    }
  }

  login(username: string, password: string): Observable<void> {
    return new Observable<void>((observer) => {
      this.api.login({ username, password }).subscribe({
        next: (res) => {
          this.setTokens(res.access, res.refresh);
          this.api.getCurrentUser().subscribe({
            next: (user) => {
              this.currentUserSubject.next(user.username);
              observer.next();
              observer.complete();
            },
            error: (err) => observer.error(err),
          });
        },
        error: (err) => observer.error(err),
      });
    });
  }

  logout(): void {
    const refresh = this.getRefreshToken();
    if (refresh) {
      this.api.logout(refresh).subscribe();
    }
    this.clearTokens();  // Clears tokens when user logs out
    this.currentUserSubject.next(null);  // Updates user state
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  private setTokens(access: string, refresh: string): void {
    console.log('[AuthService] Saving access token:', access);
    console.log('[AuthService] Saving refresh token:', refresh);
    localStorage.setItem(this.accessTokenKey, access);
    localStorage.setItem(this.refreshTokenKey, refresh);
  }

  private clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }
}
