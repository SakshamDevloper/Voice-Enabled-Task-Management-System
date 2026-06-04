import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
        this.addNotification(notification);
        this.playNotificationSound(notification);
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
    return this.http.patch(`${this.api}/${notificationId}/read`, {});
  }

  private updateUnreadCount(): void {
    const unread = this.notifications$.value.filter(n => !n.read).length;
    this.unreadCount$.next(unread);
  }

  fetchNotifications(userId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.api}/user/${userId}`);
  }

  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete(`${this.api}/${notificationId}`);
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
