import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksRespository } from './dto/task.respository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([TasksRespository])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
