import { Task } from './task.model';
import { TasksService } from './tasks.service';
import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // In controller we also need to specify task array as return type
  // because we will return an array of task as response to user
  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.getAllTasks();
  }

  @Post()
  createTask(
    @Body('title') title: string,
    @Body('description') description: string,
  ): Task {
    return this.tasksService.createTasks(title, description);
  }
}
