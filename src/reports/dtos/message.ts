import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty({
    description: 'Message indicating the transaction status',
    example: 'Report added successfully',
  })
  message: string;
}
