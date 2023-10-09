import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import {v4 as uuid} from "uuid"
import { CreateTaskDto } from './dto/create-task.dto';
@Injectable()
export class TasksService {
  // An array of task
  private tasks: Task[] = [];

  // Specify task array as return type
  getAllTasks(): Task[] {
    return this.tasks;
  }

  createTasks(CreateTaskDto: CreateTaskDto): Task {
    const { title, description} = CreateTaskDto;
    const task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }
}
