import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Task } from '../../../services/task/task';
import { Auth } from '../../../services/auth/auth';
import { 
  faTrash, 
  faEdit, 
  faCheck, 
  faPlus, 
  faTasks,
  faSearch,
  faFilter,
  faSignOutAlt,
  faCalendar,
  faExclamationCircle,
  faExclamationTriangle,
  faExclamation,
  faClock,
  faCheckCircle,
  faSort,
  faSortUp,
  faSortDown
} from '@fortawesome/free-solid-svg-icons';
import { Tasks } from '../../../models/task.model';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FaIconComponent
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList implements OnInit {
  private taskService = inject(Task);
  private authService = inject(Auth);
  private router = inject(Router);
  Math = Math;
  

  tasks = computed(() => this.taskService.filteredTasks());
  loading = computed(() => this.taskService.loading());
  error = computed(() => this.taskService.error());
  filters = computed(() => this.taskService.filters());

  sortBy = signal<'title' | 'createdAt' | 'priority' | 'dueDate'>('createdAt');
  sortDirection = signal<'asc' | 'desc'>('desc');
  showDeleteModal = signal(false);
  taskToDelete = signal<Tasks | null>(null);

  faTrash = faTrash;
  faEdit = faEdit;
  faCheck = faCheck;
  faPlus = faPlus;
  faTasks = faTasks;
  faSearch = faSearch;
  faFilter = faFilter;
  faSignOutAlt = faSignOutAlt;
  faCalendar = faCalendar;
  faExclamationCircle = faExclamationCircle;
  faExclamationTriangle = faExclamationTriangle;
  faExclamation = faExclamation;
  faClock = faClock;
  faCheckCircle = faCheckCircle;
  faSort = faSort;
  faSortUp = faSortUp;
  faSortDown = faSortDown;
  

  userName = computed(() => this.authService.getCurrentUser()?.name || 'Usuário');

  sortedTasks = computed(() => {
    const tasks = this.tasks();
    const sortBy = this.sortBy();
    const direction = this.sortDirection();
    
    return [...tasks].sort((a, b) => {
      let valueA: any, valueB: any;
      
      switch (sortBy) {
        case 'title':
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case 'createdAt':
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
          break;
        case 'dueDate':
          valueA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          valueB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1, undefined: 0 };
          valueA = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          valueB = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        default:
          return 0;
      }
      
      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  });
  
  totalTasks = computed(() => this.sortedTasks().length);
  completedTasks = computed(() => this.sortedTasks().filter(task => task.completed).length);
  pendingTasks = computed(() => this.sortedTasks().filter(task => !task.completed).length);
  
  ngOnInit(): void {
  }
  

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.taskService.updateFilters({ search: value });
  }
  
  onStatusChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as 'all' | 'completed' | 'pending';
    this.taskService.updateFilters({ status: value });
  }
  
  onPriorityChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as 'all' | 'low' | 'medium' | 'high';
    this.taskService.updateFilters({ priority: value });
  }
  
  clearFilters(): void {
    this.taskService.clearFilters();
  }
  

  toggleSort(column: 'title' | 'createdAt' | 'priority' | 'dueDate'): void {
    if (this.sortBy() === column) {
      this.sortDirection.update(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(column);
      this.sortDirection.set('asc');
    }
  }
  
  getSortIcon(column: string): any {
    if (this.sortBy() !== column) return faSort;
    return this.sortDirection() === 'asc' ? faSortUp : faSortDown;
  }
  

  toggleTaskCompletion(task: Tasks): void {
    this.taskService.toggleTaskCompletion(task);
  }
  
  confirmDeleteTask(task: Tasks): void {
    this.taskToDelete.set(task);
    this.showDeleteModal.set(true);
  }
  
  deleteTask(): void {
    const task = this.taskToDelete();
    if (task?.id) {
      this.taskService.deleteTask(task.id);
      this.closeDeleteModal();
    }
  }
  
  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.taskToDelete.set(null);
  }
  
  getPriorityIcon(priority?: string): any {
    switch (priority) {
      case 'high': return faExclamationCircle;
      case 'medium': return faExclamationTriangle;
      case 'low': return faExclamation;
      default: return null;
    }
  }
  
  getPriorityClass(priority?: string): string {
    switch (priority) {
      case 'high': return 'bg-danger';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-info';
      default: return 'bg-secondary';
    }
  }
  
  getPriorityText(priority?: string): string {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Não definida';
    }
  }
  
  isOverdue(task: Tasks): boolean {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  formatDateTime(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  // Navegação
  goToCreateTask(): void {
    this.router.navigate(['/tasks/new']);
  }
  
  goToEditTask(taskId: string): void {
    this.router.navigate(['/tasks/edit', taskId]);
  }
}
