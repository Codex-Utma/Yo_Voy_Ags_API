import { Controller, Get, Param } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsedCardDataDto } from './dtos/card-used-data';

@ApiTags('transfers')
@Controller('transfers')
export class TransfersController {
  constructor(private transfersService: TransfersService) {}

  @Get('data/:cardId')
  @ApiResponse({
    status: 200,
    description: 'Data found',
    type: UsedCardDataDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid card ID' })
  @ApiResponse({
    status: 404,
    description: 'Card not used in the last 2 hours',
  })
  getCardData(@Param('cardId') cardId: string) {
    return this.transfersService.getCardData(cardId);
  }
}
