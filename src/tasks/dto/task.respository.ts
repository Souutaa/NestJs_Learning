import { EntityRepository, Repository } from 'typeorm';
import { Task } from '../task.entity';

@EntityRepository(Task)
export class TasksRespository extends Repository<Task>{
    

}