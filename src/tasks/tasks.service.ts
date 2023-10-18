import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status-enum';
//import { v4 as uuid } from 'uuid'; bị remove
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { DeleteResult, Repository } from 'typeorm';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRespository: Repository<Task>,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const taskResult = await this.tasksRespository.find();
    if (filterDto.status) {
      taskResult.filter((task) => task.status !== filterDto.status);
    }
    if (filterDto.search) {
      taskResult.filter((task) => task.title !== filterDto.status);
    }
    return taskResult;
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRespository.findOne({
      where: {
        id: id,
      },
    });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async createTasks(CreateTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = CreateTaskDto;

    const task = this.tasksRespository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.tasksRespository.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<DeleteResult> {
    const result = await this.tasksRespository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return result;
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = status;
    await this.tasksRespository.save(task);

    return task;
  }
}
