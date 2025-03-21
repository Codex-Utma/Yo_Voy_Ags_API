import { Controller, Post, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RechargeResponseDto } from './dtos/response-recharge';
import { RechargeRequestDto } from './dtos/request-recharge';
import { UseRequestDto } from './dtos/request-use';
import { UseResponseDto } from './dtos/response-use';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post('recharge')
  @ApiResponse({
    status: 201,
    description: 'Recharged completed successfully',
    type: RechargeResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid card id' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  recharge(@Body() rechargeData: RechargeRequestDto) {
    return this.transactionsService.recharge(rechargeData);
  }

  @Post('use')
  @ApiResponse({
    status: 201,
    description: 'Use completed successfully',
    type: UseResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid serial card' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  use(@Body() useData: UseRequestDto) {
    return this.transactionsService.cardUse(useData);
  }
}
