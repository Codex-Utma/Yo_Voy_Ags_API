import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

class RouteDto {
  @ApiProperty({ example: 'Route 101' })
  name: string;
}

class BusDto {
  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({ type: RouteDto })
  Route: RouteDto;
}

class TransferDto {
  @ApiProperty({ type: BusDto, nullable: true })
  Bus: BusDto | null;
}

class CardUseDto {
  @ApiProperty({ example: 10.5, type: 'number', description: 'Monto usado en la tarjeta' })
  amount: Decimal;

  @ApiProperty({ example: new Date().toISOString(), type: 'string', format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: TransferDto })
  Transfer: TransferDto;
}

export class CardDataDto {
  @ApiProperty({ example: 12345, description: 'ID de la tarjeta' })
  cardId: number;

  @ApiProperty({ example: 150.75, description: 'Saldo actual' })
  balance: number;

  @ApiProperty({ example: true, description: 'Indica si es una tarjeta preferencial' })
  isPreferential: boolean;

  @ApiProperty({ type: [CardUseDto], description: 'Historial de usos de la tarjeta' })
  cardUses: CardUseDto[];
}

export class CardDataResponseDto {
  @ApiProperty({ type: CardDataDto })
  cardData: CardDataDto;
}
