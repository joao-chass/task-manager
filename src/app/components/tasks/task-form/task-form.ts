import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Task } from '../../../services/task/task';
import { 
  faSave, 
  faTimes, 
  faCalendar,
  faExclamationCircle,
  faExclamationTriangle,
  faExclamation,
  faArrowLeft,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { Tasks } from '../../../models/task.model';
import { Auth } from '../../../services/auth/auth';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FaIconComponent
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private taskService = inject(Task);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(Auth);

  isEditMode = signal(false);
  taskId = signal<string>('');
  loading = signal(false);
  saving = signal(false);
  error = signal('');

  taskForm: FormGroup;
  
  faSave = faSave;
  faTimes = faTimes;
  faCalendar = faCalendar;
  faExclamationCircle = faExclamationCircle;
  faExclamationTriangle = faExclamationTriangle;
  faExclamation = faExclamation;
  faArrowLeft = faArrowLeft;
  faSpinner = faSpinner;
  

  priorities = [
    { value: '', label: 'Selecione uma prioridade' },
    { value: 'low', label: 'Baixa', icon: faExclamation, class: 'text-info' },
    { value: 'medium', label: 'Média', icon: faExclamationTriangle, class: 'text-warning' },
    { value: 'high', label: 'Alta', icon: faExclamationCircle, class: 'text-danger' }
  ];

  constructor() {
    this.taskForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      description: ['', [
        Validators.maxLength(500)
      ]],
      priority: ['', Validators.required],
      dueDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadTaskData();
  }

  ngOnDestroy(): void {
    this.taskService.clearError();
  }

  private loadTaskData(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      
      if (id) {
        this.isEditMode.set(true);
        this.taskId.set(id);
        this.loading.set(true);
        
        // Buscar tarefa do serviço
        const task = this.taskService.getTaskById(id);
        
        if (task) {
          this.populateForm(task);
        } else {
    
          this.taskService.getTaskFromServer(id).subscribe({
            next: (task) => {
              this.populateForm(task);
              this.loading.set(false);
            },
            error: () => {
              this.error.set('Tarefa não encontrada');
              setTimeout(() => {
                this.router.navigate(['/task']);
              }, 2000);
              this.loading.set(false);
            }
          });
          return;
        }
        
        this.loading.set(false);
      }
    });
  }

  private populateForm(task: Tasks): void {
    const dueDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
    
    this.taskForm.patchValue({
      title: task.title,
      description: task.description || '',
      priority: task.priority || '',
      dueDate: dueDate
    });
  }

  get priorityIcon(): any {
    const priority = this.taskForm.get('priority')?.value;
    switch (priority) {
      case 'high': return faExclamationCircle;
      case 'medium': return faExclamationTriangle;
      case 'low': return faExclamation;
      default: return null;
    }
  }

  get priorityClass(): string {
    const priority = this.taskForm.get('priority')?.value;
    switch (priority) {
      case 'high': return 'border-danger text-danger';
      case 'medium': return 'border-warning text-warning';
      case 'low': return 'border-info text-info';
      default: return 'border-secondary text-secondary';
    }
  }

  get minDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.taskForm.valid && !this.saving()) {
      this.saving.set(true);
      this.error.set('');
      
      const formValue = this.taskForm.value;
      
      const dueDate = formValue.dueDate ? new Date(formValue.dueDate) : undefined;
      
      const taskData: Omit<Tasks, 'id'> = {
        title: formValue.title,
        description: formValue.description,
        priority: formValue.priority,
        dueDate: dueDate,
        completed: false,
        createdAt: new Date(),
        userId: Number(this.authService.getCurrentUser()?.id)
      };
      
      if (this.isEditMode() && this.taskId()) {
        this.taskService.updateTask(this.taskId()!, taskData);
      } else {
        this.taskService.createTask(taskData);
      }

      setTimeout(() => {
        this.saving.set(false);
        this.router.navigate(['/task']);
      }, 500);
    } else {
    
      Object.keys(this.taskForm.controls).forEach(key => {
        const control = this.taskForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/task']);
  }

  get title() { return this.taskForm.get('title'); }
  get description() { return this.taskForm.get('description'); }
  get priority() { return this.taskForm.get('priority'); }
  get dueDate() { return this.taskForm.get('dueDate'); }
}
