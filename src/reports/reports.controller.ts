import { Controller, Get, Post, Body } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReportTypeDto } from './dtos/report-types';
import { AddReportDto } from './dtos/add-report';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('/types')
  @ApiResponse({
    status: 200,
    description: 'List of report types',
    type: [ReportTypeDto],
  })
  @ApiResponse({ status: 204, description: 'No report types found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getReportTypes(): Promise<ReportTypeDto[]> {
    return this.reportsService.getReportTypes();
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Report added' })
  @ApiResponse({ status: 400, description: 'Invalid report type' })
  @ApiResponse({ status: 400, description: 'Invalid bus id' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  addReport(@Body() report: AddReportDto) {
    return this.reportsService.addReport(report);
  }
}
