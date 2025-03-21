import { ApiProperty } from '@nestjs/swagger';

export class UseResponseDto {
  @ApiProperty({
    description: 'Message indicating the transaction status',
    example: 'Use successful',
  })
  message: string;

  @ApiProperty({
    description: 'New balance after the use',
    example: 100,
  })
  newBalance: number;

  @ApiProperty({
    description: 'Date and time of the transaction',
    example: '13:00:00',
  })
  date: string;
}
