import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary(
    @Query('date') date?: string,
    @Query('role') role?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.dashboardService.getSummary(date, role, +page, +limit);
  }
}
