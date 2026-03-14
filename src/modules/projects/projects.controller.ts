import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Roles('admin')
  @Post()
  createProject(@Body() dto: CreateProjectDto, @CurrentUser() user: any) {
    return this.projectsService.createProject(dto, user);
  }

  @Roles('admin', 'management', 'employee')
  @Get()
  findProjects(@CurrentUser() user: any) {
    return this.projectsService.findProjects(user);
  }

  @Roles('admin', 'management')
  @Patch(':id')
  updateProject(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: any
  ) {
    return this.projectsService.updateProject(id, dto, user);
  }

  @Roles('admin')
  @Delete(':id')
  deleteProject(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.projectsService.deleteProject(id, user);
  }
}
