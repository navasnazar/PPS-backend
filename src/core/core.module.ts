import { Module } from '@nestjs/common';
import { DashboardGateway } from './gateways/dashboard.gateway';

@Module({
  providers: [DashboardGateway],
  exports: [DashboardGateway],
})
export class CoreModule {}