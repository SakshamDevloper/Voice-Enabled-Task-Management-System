export interface Task {
  _id?: string;
  title: string;
  description: string;
  status: 'todo' | 'inprog' | 'done';
  priority: 'high' | 'med' | 'low';
  category: string;
  dueDate: string;
  createdAt?: string;
}