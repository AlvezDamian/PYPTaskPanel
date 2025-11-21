import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus, UserRole } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new task for the authenticated user
   * Only admins can create tasks
   * @param userId - ID of the authenticated user (must be admin)
   * @param createTaskDto - Task data
   * @returns Created task with user relations
   */
  async create(userId: string, createTaskDto: CreateTaskDto) {
    const { title, description, dueDate, status, assignedTo } = createTaskDto;

    // Verify assignedTo user exists if provided
    if (assignedTo) {
      const assignedUser = await this.prisma.user.findUnique({
        where: { id: assignedTo },
      });

      if (!assignedUser) {
        throw new BadRequestException('Assigned user not found');
      }
    }

    return this.prisma.task.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        status: status || TaskStatus.TODO,
        userId,
        createdById: userId,
        assignedToId: assignedTo || null,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  /**
   * Get all tasks for the authenticated user
   * @param userId - ID of the authenticated user
   * @param status - Optional filter by status
   * @returns Array of tasks with user relations
   */
  async findAll(userId: string, status?: TaskStatus) {
    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    return this.prisma.task.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get a single task by ID (only if it belongs to the user)
   * @param userId - ID of the authenticated user
   * @param taskId - ID of the task
   * @returns Task data with user relations
   */
  async findOne(userId: string, taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('You do not have access to this task');
    }

    return task;
  }

  /**
   * Update a task
   * Any user can update the status, but only admins can update other fields
   * @param userId - ID of the authenticated user
   * @param userRole - Role of the authenticated user
   * @param taskId - ID of the task
   * @param updateTaskDto - Updated task data
   * @returns Updated task with user relations
   */
  async update(
    userId: string,
    userRole: UserRole,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    // Verify task exists
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Verify user has access to the task
    if (task.userId !== userId) {
      throw new ForbiddenException('You do not have access to this task');
    }

    const updateData: any = {};

    // Only admins can update title, description, dueDate, and assignedTo
    if (userRole === UserRole.ADMIN) {
      if (updateTaskDto.title !== undefined) {
        updateData.title = updateTaskDto.title;
      }

      if (updateTaskDto.description !== undefined) {
        updateData.description = updateTaskDto.description;
      }

      if (updateTaskDto.dueDate !== undefined) {
        updateData.dueDate = new Date(updateTaskDto.dueDate);
      }

      if (updateTaskDto.assignedTo !== undefined) {
        if (updateTaskDto.assignedTo) {
          // Verify assigned user exists
          const assignedUser = await this.prisma.user.findUnique({
            where: { id: updateTaskDto.assignedTo },
          });

          if (!assignedUser) {
            throw new BadRequestException('Assigned user not found');
          }
        }
        updateData.assignedToId = updateTaskDto.assignedTo || null;
      }
    }

    // Any user can update status
    if (updateTaskDto.status !== undefined) {
      updateData.status = updateTaskDto.status;
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  /**
   * Delete a task (only if it belongs to the user)
   * @param userId - ID of the authenticated user
   * @param taskId - ID of the task
   * @returns Deleted task
   */
  async remove(userId: string, taskId: string) {
    // Verify task exists and belongs to user
    await this.findOne(userId, taskId);

    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}

