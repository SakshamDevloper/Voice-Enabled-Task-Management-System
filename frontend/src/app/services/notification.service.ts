import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Notification {
  id?: string;
  userId: string;
  type: 'task-created' | 'task-completed' | 'task-updated' | 'task-overdue' | 'task-assigned';
  title: string;
  message: string;
  taskId?: string;
  read: boolean;
  createdAt: Date;
  sound?: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private api = 'http://localhost:5000/api/notifications';
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private unreadCount$ = new BehaviorSubject<number>(0);
  private notificationSound: HTMLAudioElement;

  constructor(private http: HttpClient) {
    this.notificationSound = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==');
    this.initializeNotifications();
  }

  private initializeNotifications(): void {
    if (this.isWebSocketSupported()) {
      this.setupWebSocket();
    }
  }

  private isWebSocketSupported(): boolean {
    return 'WebSocket' in window;
  }

  private setupWebSocket(): void {
    try {
      const ws = new WebSocket('ws://localhost:5000');
      ws.onmessage = (event) => {
        const notification = JSON.parse(event.data);
        
        // Filter by current user ID
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const currentUserId = currentUser.id || currentUser._id;
        
        if (notification.userId === currentUserId) {
          this.addNotification(notification);
          this.playNotificationSound(notification);
          this.showBrowserNotification(notification.title, {
            body: notification.message
          });
        }
      };
    } catch (err) {
      console.error('WebSocket connection failed:', err);
    }
  }

  addNotification(notification: Notification): void {
    const current = this.notifications$.value;
    this.notifications$.next([notification, ...current]);
    this.updateUnreadCount();
  }

  playNotificationSound(notification: Notification): void {
    if (notification.sound !== false && this.notificationSound) {
      try {
        this.notificationSound.play().catch(err => console.log('Sound play blocked:', err));
      } catch (err) {
        console.error('Error playing notification sound:', err);
      }
    }
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount$.asObservable();
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.http.patch(`${this.api}/${notificationId}/read`, {}).pipe(
      tap(() => {
        const current = this.notifications$.value.map(n => 
          n.id === notificationId || (n as any)._id === notificationId ? { ...n, read: true } : n
        );
        this.notifications$.next(current);
        this.updateUnreadCount();
      })
    );
  }

  private updateUnreadCount(): void {
    const unread = this.notifications$.value.filter(n => !n.read).length;
    this.unreadCount$.next(unread);
  }

  fetchNotifications(userId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.api}/user/${userId}`).pipe(
      tap(notifications => {
        this.notifications$.next(notifications);
        this.updateUnreadCount();
      })
    );
  }

  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete(`${this.api}/${notificationId}`).pipe(
      tap(() => {
        const current = this.notifications$.value.filter(n => n.id !== notificationId && (n as any)._id !== notificationId);
        this.notifications$.next(current);
        this.updateUnreadCount();
      })
    );
  }

  // Request browser notification permission
  requestNotificationPermission(): void {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }
  }

  // Show browser notification
  showBrowserNotification(title: string, options?: NotificationOptions): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }
}
