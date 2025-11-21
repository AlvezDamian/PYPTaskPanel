import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { TasksController } from '../../../src/tasks/tasks.controller';
import { TasksService } from '../../../src/tasks/tasks.service';
import { JwtAuthGuard } from '../../../src/auth/guards/jwt-auth.guard';
import {
  mockUserId,
  mockTask,
  mockTask2,
  mockCreateTaskDto,
} from '../../fixtures/test-data';

/**
 * Unit tests for TasksController
 * Tests HTTP endpoints for task CRUD operations including authorization
 */

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockUser = {
    id: mockUserId,
    email: 'test@example.com',
    role: 'ADMIN' as const,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /tasks', () => {
    /**
     * Test: POST /tasks - Crear tarea exitosa
     * Resultado esperado: Devuelve task creada con código 201
     * Justificación: Verifica creación de tareas autenticadas
     */
    it('should create a task successfully', async () => {
      // Arrange
      mockTasksService.create.mockResolvedValue(mockTask);

      // Act
      const result = await controller.create(mockUser, mockCreateTaskDto);

      // Assert
      expect(result).toEqual(mockTask);
      expect(tasksService.create).toHaveBeenCalledWith(
        mockUserId,
        mockCreateTaskDto,
      );
    });
  });

  describe('GET /tasks', () => {
    /**
     * Test: GET /tasks - Obtener todas las tareas
     * Resultado esperado: Devuelve array de tasks del usuario
     * Justificación: Verifica listado de tareas con filtrado por usuario
     */
    it('should return all tasks for the user', async () => {
      // Arrange
      const tasks = [mockTask, mockTask2];
      mockTasksService.findAll.mockResolvedValue(tasks);

      // Act
      const result = await controller.findAll(mockUser);

      // Assert
      expect(result).toEqual(tasks);
      expect(tasksService.findAll).toHaveBeenCalledWith(mockUserId, undefined);
    });

    /**
     * Test: GET /tasks?status=COMPLETED - Filtrar por status
     * Resultado esperado: Devuelve solo tasks con el status especificado
     * Justificación: Verifica filtrado opcional por status
     */
    it('should filter tasks by status', async () => {
      // Arrange
      const completedTasks = [mockTask2];
      mockTasksService.findAll.mockResolvedValue(completedTasks);

      // Act
      const result = await controller.findAll(mockUser, TaskStatus.DONE);

      // Assert
      expect(result).toEqual(completedTasks);
      expect(tasksService.findAll).toHaveBeenCalledWith(
        mockUserId,
        TaskStatus.DONE,
      );
    });
  });

  describe('GET /tasks/:id', () => {
    /**
     * Test: GET /tasks/:id - Obtener tarea por ID
     * Resultado esperado: Devuelve task si pertenece al usuario
     * Justificación: Verifica acceso a tarea específica
     */
    it('should return task by id', async () => {
      // Arrange
      mockTasksService.findOne.mockResolvedValue(mockTask);

      // Act
      const result = await controller.findOne(mockUser, mockTask.id);

      // Assert
      expect(result).toEqual(mockTask);
      expect(tasksService.findOne).toHaveBeenCalledWith(mockUserId, mockTask.id);
    });

    /**
     * Test: GET /tasks/:id - Tarea no encontrada (404)
     * Resultado esperado: Lanza NotFoundException
     * Justificación: Verifica manejo de tarea inexistente
     */
    it('should throw NotFoundException when task does not exist', async () => {
      // Arrange
      mockTasksService.findOne.mockRejectedValue(
        new NotFoundException('Task not found'),
      );

      // Act & Assert
      await expect(
        controller.findOne(mockUser, 'non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });

    /**
     * Test: GET /tasks/:id - Tarea de otro usuario (403)
     * Resultado esperado: Lanza ForbiddenException
     * Justificación: Verifica protección contra acceso no autorizado
     */
    it('should throw ForbiddenException when task belongs to another user', async () => {
      // Arrange
      mockTasksService.findOne.mockRejectedValue(
        new ForbiddenException('You do not have access to this task'),
      );

      // Act & Assert
      await expect(
        controller.findOne(mockUser, 'other-user-task-id'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('PATCH /tasks/:id', () => {
    /**
     * Test: PATCH /tasks/:id - Actualizar tarea exitosa
     * Resultado esperado: Devuelve task actualizada
     * Justificación: Verifica actualización de tareas propias
     */
    it('should update task successfully', async () => {
      // Arrange
      const updateDto = { title: 'Updated Title' };
      const updatedTask = { ...mockTask, ...updateDto };
      mockTasksService.update.mockResolvedValue(updatedTask);

      // Act
      const result = await controller.update(mockUser, mockTask.id, updateDto);

      // Assert
      expect(result).toEqual(updatedTask);
      expect(tasksService.update).toHaveBeenCalledWith(
        mockUserId,
        mockUser.role,
        mockTask.id,
        updateDto,
      );
    });
  });

  describe('DELETE /tasks/:id', () => {
    /**
     * Test: DELETE /tasks/:id - Eliminar tarea exitosa
     * Resultado esperado: Devuelve task eliminada
     * Justificación: Verifica eliminación de tareas propias
     */
    it('should delete task successfully', async () => {
      // Arrange
      mockTasksService.remove.mockResolvedValue(mockTask);

      // Act
      const result = await controller.remove(mockUser, mockTask.id);

      // Assert
      expect(result).toEqual(mockTask);
      expect(tasksService.remove).toHaveBeenCalledWith(mockUserId, mockTask.id);
    });
  });
});

