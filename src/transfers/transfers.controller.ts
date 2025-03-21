import { Controller, Get, Param } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('transfers')
@Controller('transfers')
export class TransfersController {
  constructor(private transfersService: TransfersService) {}

  @Get('data/:cardId')
  getCardData(@Param('cardId') cardId: string) {
    return this.transfersService.getCardData(cardId);
  }
}
