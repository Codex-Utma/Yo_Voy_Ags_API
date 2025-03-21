import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class UseRequestDto {
  @ApiProperty({
    description: 'Serial number of the card',
    example: '1A-2B-3C-4D',
  })
  @IsString()
  cardSerial: string;

  @ApiProperty({
    description: 'Id of the bus',
    example: 1234,
  })
  @IsNumber()
  @IsPositive()
  busId: number;

  @ApiProperty({
    description: 'Latitude of the bus',
    example: 121.123456,
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    description: 'Longitude of the bus',
    example: 121.123456,
  })
  @IsNumber()
  longitude: number;
}
