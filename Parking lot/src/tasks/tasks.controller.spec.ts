import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDto } from '../dto/create-task.dto';
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

const mockUser: User = { id: 'user123', username: 'testuser' } as User;

const mockTasksService = () => ({
  getAllTasks: jest.fn(),
  getTaskById: jest.fn(),
  createTask: jest.fn(),
  deleteTask: jest.fn(),
  updateTaskStatus: jest.fn(),
});

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: ReturnType<typeof mockTasksService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useFactory: mockTasksService }],
    }).compile();

    tasksController = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService) as any;
  });

  describe('getTasks', () => {
    it('calls service and returns filtered tasks', async () => {
      const filterDto: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'test',
      };
      const mockTasks = ['task1', 'task2'];
      tasksService.getAllTasks.mockResolvedValue(mockTasks);

      const result = await tasksController.getTasks(filterDto, mockUser);
      expect(result).toEqual(mockTasks);
      expect(tasksService.getAllTasks).toHaveBeenCalledWith(
        filterDto,
        mockUser,
      );
    });
  });

  describe('getTaskById', () => {
    it('returns task by id', async () => {
      const mockTask = { title: 'Test Task', description: 'Desc' };
      tasksService.getTaskById.mockResolvedValue(mockTask);

      const result = await tasksController.getTaskById('task123', mockUser);
      expect(result).toEqual(mockTask);
    });
  });

  describe('createTask', () => {
    it('creates a task and returns it', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Test Desc',
      };
      const mockTask = {
        id: 'task1',
        ...createTaskDto,
        status: TaskStatus.OPEN,
      };
      tasksService.createTask.mockResolvedValue(mockTask);

      const result = await tasksController.createTask(createTaskDto, mockUser);
      expect(result).toEqual(mockTask);
    });
  });

  describe('deleteTask', () => {
    it('calls deleteTask with correct values', async () => {
      tasksService.deleteTask.mockResolvedValue(undefined);
      await tasksController.deleteTask('task123', mockUser);
      expect(tasksService.deleteTask).toHaveBeenCalledWith('task123', mockUser);
    });
  });

  describe('updateTaskStatus', () => {
    it('updates task status and returns updated task', async () => {
      const mockUpdatedTask = {
        id: 'task123',
        title: 'Test Task',
        status: TaskStatus.DONE,
      };
      tasksService.updateTaskStatus.mockResolvedValue(mockUpdatedTask);

      const result = await tasksController.updateTaskStatus(
        'task123',
        { status: TaskStatus.DONE },
        mockUser,
      );
      expect(result).toEqual(mockUpdatedTask);
    });
  });
});
