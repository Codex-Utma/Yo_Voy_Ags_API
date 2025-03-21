import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class RechargeRequestDto {
  @ApiProperty({
    description: 'Id of the card',
    example: 12345678,
  })
  @IsNumber()
  @IsPositive()
  cardId: number;

  @ApiProperty({
    description: 'Amount that will be recharged',
    example: 50,
  })
  @IsNumber()
  @IsPositive()
  amount: number;
}
