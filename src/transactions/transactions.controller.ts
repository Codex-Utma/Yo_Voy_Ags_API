import { Controller, Post, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RechargeResponseDto } from './dtos/response-recharge';
import { RechargeRequestDto } from './dtos/request-recharge';

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
  recharge(@Body() rechargeData: RechargeRequestDto) {
    return this.transactionsService.recharge(rechargeData);
  }
}
