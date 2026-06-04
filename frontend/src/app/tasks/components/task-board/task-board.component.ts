import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';
import { AuthService } from '../../../services/auth.service';
import { NotificationService, Notification } from '../../../services/notification.service';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskCardComponent],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.css'
})
export class TaskBoardComponent implements OnInit {

  tasks: Task[] = [];
  searchQuery = '';
  filterPriority = 'all';
  showAddModal = false;
  isListening = false;

  newTask: Partial<Task> = {
    title: '',
    description: '',
    status: 'todo',
    priority: 'med',
    category: '',
    dueDate: ''
  };

  notifications: Notification[] = [];
  unreadCount = 0;
  showNotificationsDropdown = false;

  currentUser: any = null;
  showProfileDropdown = false;
  showEditProfileModal = false;
  editProfileForm = { firstName: '', lastName: '', email: '', phone: '' };
  profileSuccessMsg = '';
  profileErrorMsg = '';

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });

    const user = this.authService.getUser();
    this.currentUser = user;
    const userId = user?.id || user?._id;
    if (userId) {
      this.notificationService.requestNotificationPermission();
      this.notificationService.fetchNotifications(userId).subscribe();
      
      this.notificationService.getNotifications().subscribe(list => {
        this.notifications = list;
      });
      
      this.notificationService.getUnreadCount().subscribe(count => {
        this.unreadCount = count;
      });
    }
  }

  toggleProfileDropdown(): void {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  openEditProfileModal(): void {
    this.currentUser = this.authService.getUser();
    this.editProfileForm = {
      firstName: this.currentUser.firstName || '',
      lastName: this.currentUser.lastName || '',
      email: this.currentUser.email || '',
      phone: this.currentUser.phone || ''
    };
    this.showEditProfileModal = true;
    this.showProfileDropdown = false;
    this.profileSuccessMsg = '';
    this.profileErrorMsg = '';
  }

  saveProfile(): void {
    this.profileSuccessMsg = '';
    this.profileErrorMsg = '';
    this.authService.updateProfile(this.editProfileForm).subscribe({
      next: (res: any) => {
        this.profileSuccessMsg = 'Profile updated successfully!';
        this.currentUser = res.user;
        setTimeout(() => {
          this.showEditProfileModal = false;
        }, 1500);
      },
      error: (err: any) => {
        this.profileErrorMsg = err?.error?.message || 'Error updating profile. Please try again.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleNotificationsDropdown(): void {
    this.showNotificationsDropdown = !this.showNotificationsDropdown;
  }

  markNotificationAsRead(notification: Notification): void {
    const id = notification.id || (notification as any)._id;
    if (id) {
      this.notificationService.markAsRead(id).subscribe();
    }
  }

  deleteNotification(notification: Notification): void {
    const id = notification.id || (notification as any)._id;
    if (id) {
      this.notificationService.deleteNotification(id).subscribe();
    }
  }

  clearAllNotifications(): void {
    this.notifications.forEach(n => {
      const id = n.id || (n as any)._id;
      if (id) {
        this.notificationService.deleteNotification(id).subscribe();
      }
    });
  }

  get filtered(): Task[] {
    return this.tasks.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchFilter = this.filterPriority === 'all' || t.priority === this.filterPriority;
      return matchSearch && matchFilter;
    });
  }

  get todoTasks()   { return this.filtered.filter(t => t.status === 'todo'); }
  get inprogTasks() { return this.filtered.filter(t => t.status === 'inprog'); }
  get doneTasks()   { return this.filtered.filter(t => t.status === 'done'); }

  toggleDone(task: Task): void {
    const newStatus = task.status === 'done' ? 'todo' : 'done';

    this.taskService.updateTask(task._id!, { status: newStatus })
      .subscribe(() => task.status = newStatus);
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id)
      .subscribe(() => {
        this.tasks = this.tasks.filter(t => t._id !== id);
      });
  }

  addTask(): void {
    if (!this.newTask.title) return;

    this.taskService.createTask(this.newTask).subscribe((task: Task) => {
      this.tasks.push(task);
      this.showAddModal = false;

      this.newTask = {
        title: '',
        description: '',
        status: 'todo',
        priority: 'med',
        category: '',
        dueDate: ''
      };
    });
  }

  startVoice(): void {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    this.isListening = true;
    recognition.start();

    recognition.onresult = (event: any) => {
      this.newTask.title = event.results[0][0].transcript;
      this.isListening = false;
      this.showAddModal = true;
    };

    recognition.onerror = () => { this.isListening = false; };
    recognition.onend   = () => { this.isListening = false; };
  }
}