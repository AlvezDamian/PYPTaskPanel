import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TaskStatus, UserRole } from '@prisma/client';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Create a new task
   * Only admins can create tasks
   * @param user - Authenticated user (from JWT)
   * @param createTaskDto - Task data
   * @returns Created task
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  create(
    @CurrentUser() user: any,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(user.id, createTaskDto);
  }

  /**
   * Get all tasks for the authenticated user
   * @param user - Authenticated user (from JWT)
   * @param status - Optional query parameter to filter by status
   * @returns Array of tasks
   */
  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query('status') status?: TaskStatus,
  ) {
    return this.tasksService.findAll(user.id, status);
  }

  /**
   * Get a single task by ID
   * @param user - Authenticated user (from JWT)
   * @param id - Task ID
   * @returns Task data
   */
  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.tasksService.findOne(user.id, id);
  }

  /**
   * Update a task
   * Any user can update the status, but only admins can update other fields
   * @param user - Authenticated user (from JWT)
   * @param id - Task ID
   * @param updateTaskDto - Updated task data
   * @returns Updated task
   */
  @Patch(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(user.id, user.role, id, updateTaskDto);
  }

  /**
   * Delete a task
   * Only admins can delete tasks
   * @param user - Authenticated user (from JWT)
   * @param id - Task ID
   * @returns Deleted task
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.tasksService.remove(user.id, id);
  }
}

