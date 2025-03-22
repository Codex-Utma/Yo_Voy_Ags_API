import { ApiProperty } from '@nestjs/swagger';

class BusDataDto {
  @ApiProperty({ example: 1, description: 'Bus ID' })
  id: number;

  @ApiProperty({ example: 'Route 101', description: 'Bus route name' })
  route: string;
}

class UseData {
  @ApiProperty({ type: BusDataDto, description: 'Bus details' })
  busData: BusDataDto;

  @ApiProperty({
    example: new Date().toISOString(),
    type: 'string',
    format: 'date-time',
    description: 'Last usage timestamp',
  })
  lastUsed: Date;
}

export class UsedCardDataDto {
  @ApiProperty({ example: 'Data found', description: 'Response message' })
  message: string;

  @ApiProperty({ type: UseData, description: 'Card usage data' })
  data: UseData;
}
