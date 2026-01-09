import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Auth } from '../auth/auth';
import { TaskFilters, Tasks } from '../../models/task.model';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Task {
  private http = inject(HttpClient);
  private authService = inject(Auth);
  
  private apiUrl = 'http://localhost:3000/tasks';

  private tasksState = signal<Tasks[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string>('');
  private filtersState = signal<TaskFilters>({
    search: '',
    status: 'all',
    priority: 'all'
  });
  

  tasks = computed(() => this.tasksState());
  loading = computed(() => this.loadingState());
  error = computed(() => this.errorState());
  filters = computed(() => this.filtersState());

  filteredTasks = computed(() => {
    const tasks = this.tasksState();
    const filters = this.filtersState();
    
    let filtered = tasks;
    

    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      filtered = filtered.filter(task => task.userId == currentUser.id);
    }

    if (filters.status === 'completed') {
      filtered = filtered.filter(task => task.completed);
    } else if (filters.status === 'pending') {
      filtered = filtered.filter(task => !task.completed);
    }

    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }
    
  
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Ordenar por data de criação (mais recente primeiro)
    return [...filtered].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });
  
  constructor() {
    this.loadTasks();
  }
  
  loadTasks(): void {
    this.loadingState.set(true);
    this.errorState.set('');
    
    this.http.get<Tasks[]>(this.apiUrl).pipe(
      tap(tasks => {
        this.tasksState.set(tasks);
        this.loadingState.set(false);
      }),
      catchError(error => {
        this.errorState.set('Erro ao carregar tarefas');
        this.loadingState.set(false);
        return throwError(() => error);
      })
    ).subscribe();
  }
  
  getTask(id: number): Observable<Tasks> {
    return this.http.get<Tasks>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        this.errorState.set('Erro ao carregar tarefa');
        return throwError(() => error);
      })
    );
  }
  
  createTask(task: Omit<Tasks, 'id'>): void {
    this.loadingState.set(true);
    
    const currentUser = this.authService.getCurrentUser();
    const taskWithUser = {
      ...task,
      userId: currentUser?.id || 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.http.post<Tasks>(this.apiUrl, taskWithUser).pipe(
      tap(newTask => {
        // Atualizar estado com nova tarefa
        this.tasksState.update(tasks => [...tasks, newTask]);
        this.loadingState.set(false);
      }),
      catchError(error => {
        this.errorState.set('Erro ao criar tarefa');
        this.loadingState.set(false);
        return throwError(() => error);
      })
    ).subscribe();
  }
  
  updateTask(id: string, task: Partial<Tasks>): void {
    this.loadingState.set(true);
    
    const updatedTask = {
      ...task,
      updatedAt: new Date()
    };
    
    this.http.put<Tasks>(`${this.apiUrl}/${id}`, updatedTask).pipe(
      tap(updated => {
        // Atualizar tarefa no estado
        this.tasksState.update(tasks => 
          tasks.map(t => t.id === id ? { ...t, ...updated } : t)
        );
        this.loadingState.set(false);
      }),
      catchError(error => {
        this.errorState.set('Erro ao atualizar tarefa');
        this.loadingState.set(false);
        return throwError(() => error);
      })
    ).subscribe();
  }

  
  deleteTask(id: string): void {
    this.loadingState.set(true);
    
    this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // Remover tarefa do estado
        this.tasksState.update(tasks => tasks.filter(t => t.id !== id));
        this.loadingState.set(false);
      }),
      catchError(error => {
        this.errorState.set('Erro ao excluir tarefa');
        this.loadingState.set(false);
        return throwError(() => error);
      })
    ).subscribe();
  }
  
  updateFilters(filters: Partial<TaskFilters>): void {
    this.filtersState.update(current => ({ ...current, ...filters }));
  }
  getTaskById(id: string): Tasks | undefined {
    return this.tasksState().find(task => task.id === id);
  }

  getTaskFromServer(id: string): Observable<Tasks> {
    return this.http.get<Tasks>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        this.errorState.set('Erro ao carregar tarefa');
        return throwError(() => error);
      })
    );
  }
  
  clearFilters(): void {
    this.filtersState.set({
      search: '',
      status: 'all',
      priority: 'all'
    });
  }
  
  toggleTaskCompletion(task: Tasks): void {
    const updatedTask = { ...task, completed: !task.completed };
    this.updateTask(task.id!, updatedTask);
  }


  clearError(): void {
    this.errorState.set('');
  }
}
