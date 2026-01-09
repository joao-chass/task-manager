export interface Tasks {
    id?: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    updatedAt?: Date;
    dueDate?: Date;
    priority?: 'low' | 'medium' | 'high';
    userId: number;
  }
  
  export interface TaskFilters {
    search: string;
    status: 'all' | 'completed' | 'pending';
    priority?: 'all' | 'low' | 'medium' | 'high';
  }