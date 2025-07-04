import { IsEnum } from 'class-validator';
import { TaskStatus } from '../tasks/tasks-status.enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus, {
    message: 'Status must be one of: open, in-progress, done',
  })
  status: TaskStatus;
}