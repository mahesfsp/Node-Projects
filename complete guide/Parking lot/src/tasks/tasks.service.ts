import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';

import { CreateTaskDto } from '../dto/create-task.dto';
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    private tasksRepository: TasksRepository,
  ) { }


  getAllTasks(filterDto: GetTasksFilterDto,user:User): Promise<Task[]> {
    return this.tasksRepository.getAllTasks(filterDto,user);

  }
  async getTaskById(id: string,user:User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id,user } });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  // async deleteTask(id: string): Promise<Task> {
  //   const found = await this.tasksRepository.findOne({ where: { id } });
  //   if (!found) {
  //     throw new NotFoundException(`Task with ID "${id}" not found`);
  //   }
  //   await this.tasksRepository.remove(found);
  //   return found;
  // }

  async deleteTask(id: string,user:User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }


  createTask(CreateTaskDto: CreateTaskDto,user:User): Promise<Task> {
    return this.tasksRepository.createTask(CreateTaskDto,user);
  }

  async updateTaskStatus(id: string, status: TaskStatus,user:User): Promise<Task> {
    const task = await this.getTaskById(id,user);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}