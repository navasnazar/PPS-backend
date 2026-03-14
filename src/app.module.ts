import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { MilestonesModule } from './modules/milestones/milestones.module';
import { AllocationsModule } from './modules/allocations/allocations.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ActivityLogsModule } from './modules/activitylogs/activitylogs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.MONGO_URI!),
    CoreModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    ProjectsModule,
    MilestonesModule,
    AllocationsModule,
    DashboardModule,
    ActivityLogsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
