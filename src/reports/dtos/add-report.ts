import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class AddReportDto {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier of the report type',
  })
  readonly reportTypeId: number;
  @ApiProperty({ example: 1, description: 'Unique identifier of the bus' })
  readonly busId: number;

  @ApiProperty({
    example: 'Bus has a flat tire',
    description: 'Description of the report',
  })
  @IsString()
  readonly description: string;
}
