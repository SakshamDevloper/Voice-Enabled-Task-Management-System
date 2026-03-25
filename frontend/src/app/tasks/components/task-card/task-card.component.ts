import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {

  @Input() task!: Task;

  @Output() onToggle = new EventEmitter<Task>();
  @Output() onDelete = new EventEmitter<string>();

  priorityLabel: Record<string, string> = {
    high: 'High',
    med: 'Medium',
    low: 'Low'
  };
}