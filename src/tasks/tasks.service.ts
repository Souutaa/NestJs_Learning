import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status-enum';
//import { v4 as uuid } from 'uuid'; bị remove
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
@Injectable()
export class TasksService {
  // An array of task
  //Vì sẽ lưu trữ các task vào database nên xoá khai báo array task
  //private tasks: Task[] = []; --> delete

  // Specify task array as return type
  
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // getTaskById(id: string): Task {
  //   const found = this.tasks.find((task) => task.id === id);
  //   if (!found) {
  //     throw new NotFoundException(`Task with "${id}" not found!`);
  //   }
  //   return found;
  // }

  // createTasks(CreateTaskDto: CreateTaskDto): Task {
  //   const { title, description } = CreateTaskDto;
  //   const task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };

  //   this.tasks.push(task);
  //   return task;
  // }

  // deleteTask(id: string): void {
  //   const found = this.tasks.find((task) => task.id === id);
  //   this.tasks = this.tasks.filter((task) => task.id !== id);
  // }

  // updateTaskStatus(id: string, status: TaskStatus) {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }

  // getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;

  //   let tasks = this.getAllTasks();

  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }

  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }

  //   return tasks;
  // }
}
