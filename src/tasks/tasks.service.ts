import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status-enum';
//import { v4 as uuid } from 'uuid'; bị remove
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { DeleteResult, Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRespository: Repository<Task>,
  ) {}

  async getTasks({ status, search }: GetTasksFilterDto): Promise<Task[]> {
    const query = this.tasksRespository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
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

  async createTasks(CreateTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = CreateTaskDto;

    const task = this.tasksRespository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
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
