import { Injectable } from '@nestjs/common';
import { Task } from './task.model';

@Injectable()
export class TasksService {
  // An array of task
  private tasks: Task[] = [];

  // Specify task array as return type
  getAllTasks(): Task[] {
    return this.tasks;
  }
}
