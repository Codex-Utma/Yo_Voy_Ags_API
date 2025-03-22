import { ApiProperty } from '@nestjs/swagger';

class ReportTypeDto {
  @ApiProperty({ example: 'Incident' })
  name: string;
}

class RouteDto {
  @ApiProperty({ example: 'Route 101' })
  name: string;
}

class BusDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ type: RouteDto })
  Route: RouteDto;
}

class ReportDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Report description' })
  description: string;

  @ApiProperty({ example: new Date().toISOString(), type: String })
  createdAt: Date;

  @ApiProperty({ type: ReportTypeDto })
  ReportType: ReportTypeDto;

  @ApiProperty({ type: BusDto })
  Bus: BusDto;
}

export class GetReportsResponseDto {
  @ApiProperty({ example: 'Reports retrieved successfully' })
  message: string;

  @ApiProperty({ type: [ReportDto] })
  data: ReportDto[];
}
