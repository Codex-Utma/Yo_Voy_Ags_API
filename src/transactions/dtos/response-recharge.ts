import { ApiProperty } from '@nestjs/swagger';

export class RechargeResponseDto {
  @ApiProperty({
    description: 'Message indicating the transaction status',
    example: 'Recharge successful',
  })
  message: string;

  @ApiProperty({
    description: 'New balance after the transaction',
    example: 100,
  })
  newBalance: number;
}
