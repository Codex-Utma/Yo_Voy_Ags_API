import { ApiProperty } from '@nestjs/swagger';

export class ReportTypeDto {
  @ApiProperty({ example: 1, description: 'Unique identifier of the report' })
  readonly id: number;

  @ApiProperty({
    example: 'Security Report',
    description: 'Name of the report type',
  })
  readonly name: string;
}
