import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { User } from '../auth/user.entity';

const mockUser = { id: 'someUserId', username: 'testuser' } as User;

const mockTasksRepository = () => ({
  getAllTasks: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  createTask: jest.fn(),
  save: jest.fn(),
});

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getAllTasks', () => {
    it('calls TasksRepository.getAllTasks and returns result', async () => {
      const mockTasks = ['task1', 'task2'];
      const filterDto = {} as GetTasksFilterDto;

      tasksRepository.getAllTasks.mockResolvedValue(mockTasks);
      const result = await tasksService.getAllTasks(filterDto, mockUser);

      expect(result).toEqual(mockTasks);
      expect(tasksRepository.getAllTasks).toHaveBeenCalledWith(
        filterDto,
        mockUser,
      );
    });
  });

  describe('getTaskById', () => {
    it('returns the task if found', async () => {
      const mockTask = { title: 'Test Task', id: 'abc' };
      tasksRepository.findOne.mockResolvedValue(mockTask);
      expect(await tasksService.getTaskById('abc', mockUser)).toEqual(mockTask);
    });

    it('throws an error if not found', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      await expect(tasksService.getTaskById('abc', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteTask', () => {
    it('throws error if no task is deleted', async () => {
      tasksRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(tasksService.deleteTask('1', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deletes successfully', async () => {
      tasksRepository.delete.mockResolvedValue({ affected: 1 });
      await expect(
        tasksService.deleteTask('1', mockUser),
      ).resolves.not.toThrow();
    });
  });

  describe('updateTaskStatus', () => {
    it('updates the status and returns task', async () => {
      const save = jest.fn().mockResolvedValue(true);
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save,
      });

      const result = await tasksService.updateTaskStatus(
        'abc',
        TaskStatus.DONE,
        mockUser,
      );
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});
