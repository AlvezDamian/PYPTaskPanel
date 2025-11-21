import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { TaskStatus, UserRole } from '@prisma/client';
import { TasksService } from '../../../src/tasks/tasks.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import {
  createMockPrismaService,
  getPrismaServiceMock,
  MockPrismaService,
} from '../../utils/test-helpers';
import {
  mockUserId,
  mockUserId2,
  mockTaskId,
  mockTask,
  mockTask2,
  mockTaskOtherUser,
  mockCreateTaskDto,
} from '../../fixtures/test-data';

/**
 * Unit tests for TasksService
 * Tests task CRUD operations including authorization checks
 */

describe('TasksService', () => {
  let service: TasksService;
  let prismaService: MockPrismaService;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prismaService = getPrismaServiceMock(module);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    /**
     * Test: create() - Tarea creada exitosamente
     * Resultado esperado: Devuelve task creada con userId correcto
     * Justificación: Verifica creación de tareas con usuario autenticado
     */
    it('should create a task successfully', async () => {
      // Arrange
      const newTask = { ...mockTask, ...mockCreateTaskDto };
      prismaService.task.create.mockResolvedValue(newTask);

      // Act
      const result = await service.create(mockUserId, mockCreateTaskDto);

      // Assert
      expect(result).toEqual(newTask);
      expect(prismaService.task.create).toHaveBeenCalledWith({
        data: {
          title: mockCreateTaskDto.title,
          description: mockCreateTaskDto.description,
          dueDate: new Date(mockCreateTaskDto.dueDate),
          status: mockCreateTaskDto.status || TaskStatus.TODO,
          userId: mockUserId,
          createdById: mockUserId,
          assignedToId: mockCreateTaskDto.assignedTo || null,
        },
        include: expect.any(Object),
      });
    });
  });

  describe('findAll', () => {
    /**
     * Test: findAll() - Obtener todas las tareas del usuario
     * Resultado esperado: Devuelve array de tasks del usuario
     * Justificación: Verifica filtrado por userId para asegurar aislamiento de datos
     */
    it('should return all tasks for the user', async () => {
      // Arrange
      const tasks = [mockTask, mockTask2];
      prismaService.task.findMany.mockResolvedValue(tasks);

      // Act
      const result = await service.findAll(mockUserId);

      // Assert
      expect(result).toEqual(tasks);
      expect(prismaService.task.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });

    /**
     * Test: findAll() - Filtrar por status
     * Resultado esperado: Devuelve solo tasks con el status especificado
     * Justificación: Verifica filtrado adicional por status manteniendo aislamiento de usuario
     */
    it('should filter tasks by status', async () => {
      // Arrange
      const completedTasks = [mockTask2];
      prismaService.task.findMany.mockResolvedValue(completedTasks);

      // Act
      const result = await service.findAll(mockUserId, TaskStatus.DONE);

      // Assert
      expect(result).toEqual(completedTasks);
      expect(prismaService.task.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId, status: TaskStatus.DONE },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    /**
     * Test: findOne() - Tarea encontrada
     * Resultado esperado: Devuelve task si pertenece al usuario
     * Justificación: Verifica acceso a tarea propia
     */
    it('should return task when found and belongs to user', async () => {
      // Arrange
      prismaService.task.findUnique.mockResolvedValue(mockTask);

      // Act
      const result = await service.findOne(mockUserId, mockTaskId);

      // Assert
      expect(result).toEqual(mockTask);
      expect(prismaService.task.findUnique).toHaveBeenCalledWith({
        where: { id: mockTaskId },
        include: expect.any(Object),
      });
    });

    /**
     * Test: findOne() - Tarea no encontrada (NotFoundException)
     * Resultado esperado: Lanza NotFoundException
     * Justificación: Maneja casos de tarea inexistente
     */
    it('should throw NotFoundException when task does not exist', async () => {
      // Arrange
      prismaService.task.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(mockUserId, 'non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne(mockUserId, 'non-existent-id')).rejects.toThrow(
        'Task not found',
      );
    });

    /**
     * Test: findOne() - Tarea de otro usuario (ForbiddenException)
     * Resultado esperado: Lanza ForbiddenException
     * Justificación: Previene acceso no autorizado a tareas de otros usuarios
     */
    it('should throw ForbiddenException when task belongs to another user', async () => {
      // Arrange
      prismaService.task.findUnique.mockResolvedValue(mockTaskOtherUser);

      // Act & Assert
      await expect(service.findOne(mockUserId, mockTaskOtherUser.id)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.findOne(mockUserId, mockTaskOtherUser.id)).rejects.toThrow(
        'You do not have access to this task',
      );
    });
  });

  describe('update', () => {
    /**
     * Test: update() - Actualización exitosa
     * Resultado esperado: Devuelve task actualizada
     * Justificación: Verifica actualización de tareas propias
     */
    it('should update task successfully', async () => {
      // Arrange
      const updateDto = {
        title: 'Updated Title',
        description: 'Updated Description',
      };
      const updatedTask = { ...mockTask, ...updateDto };
      prismaService.task.findUnique.mockResolvedValue(mockTask);
      prismaService.task.update.mockResolvedValue(updatedTask);

      // Act
      const result = await service.update(mockUserId, UserRole.ADMIN, mockTaskId, updateDto);

      // Assert
      expect(result).toEqual(updatedTask);
      expect(prismaService.task.findUnique).toHaveBeenCalledWith({
        where: { id: mockTaskId },
      });
      expect(prismaService.task.update).toHaveBeenCalledWith({
        where: { id: mockTaskId },
        data: {
          title: updateDto.title,
          description: updateDto.description,
        },
        include: expect.any(Object),
      });
    });

    /**
     * Test: update() - Falla si tarea no pertenece al usuario
     * Resultado esperado: Lanza ForbiddenException antes de actualizar
     * Justificación: Previene actualización no autorizada
     */
    it('should throw ForbiddenException when updating another user task', async () => {
      // Arrange
      const updateDto = { title: 'Updated Title' };
      prismaService.task.findUnique.mockResolvedValue(mockTaskOtherUser);

      // Act & Assert
      await expect(
        service.update(mockUserId, UserRole.ADMIN, mockTaskOtherUser.id, updateDto),
      ).rejects.toThrow(ForbiddenException);
      expect(prismaService.task.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    /**
     * Test: remove() - Eliminación exitosa
     * Resultado esperado: Devuelve task eliminada
     * Justificación: Verifica eliminación de tareas propias
     */
    it('should delete task successfully', async () => {
      // Arrange
      prismaService.task.findUnique.mockResolvedValue(mockTask);
      prismaService.task.delete.mockResolvedValue(mockTask);

      // Act
      const result = await service.remove(mockUserId, mockTaskId);

      // Assert
      expect(result).toEqual(mockTask);
      expect(prismaService.task.findUnique).toHaveBeenCalledWith({
        where: { id: mockTaskId },
        include: expect.any(Object),
      });
      expect(prismaService.task.delete).toHaveBeenCalledWith({
        where: { id: mockTaskId },
      });
    });

    /**
     * Test: remove() - Falla si tarea no pertenece al usuario
     * Resultado esperado: Lanza ForbiddenException antes de eliminar
     * Justificación: Previene eliminación no autorizada
     */
    it('should throw ForbiddenException when deleting another user task', async () => {
      // Arrange
      prismaService.task.findUnique.mockResolvedValue(mockTaskOtherUser);

      // Act & Assert
      await expect(service.remove(mockUserId, mockTaskOtherUser.id)).rejects.toThrow(
        ForbiddenException,
      );
      expect(prismaService.task.delete).not.toHaveBeenCalled();
    });
  });
});

