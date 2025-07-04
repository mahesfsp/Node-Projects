// import { Module } from '@nestjs/common';
// import { TasksController } from './tasks.controller';
// import { TasksService } from './tasks.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { TasksRepository } from './tasks.repository';

// @Module({
//   imports: [TypeOrmModule.forFeature([TasksRepository])],
//   controllers: [TasksController],
//   providers: [TasksService],
// })
// export class TasksModule { }

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { DataSource } from 'typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]),
    AuthModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: TasksRepository,
      useFactory: (dataSource: DataSource) => {
        return new TasksRepository(dataSource);
      },
      inject: [DataSource],
    },
  ],
})
export class TasksModule { }

