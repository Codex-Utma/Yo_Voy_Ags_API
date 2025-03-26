import { ApiProperty } from '@nestjs/swagger';

export class RouteDto {
  @ApiProperty({
    example: 'Ruta 20',
    description: 'Nombre de la ruta del autobús',
  })
  name: string;
}

export class BusDto {
  @ApiProperty({ example: 1234, description: 'ID del autobús' })
  id: number;

  @ApiProperty({
    type: RouteDto,
    description: 'Información de la ruta del autobús',
  })
  Route: RouteDto;
}

export class CardUsedDto {
  @ApiProperty({ example: 32, description: 'ID de la tarjeta utilizada' })
  id: number;

  @ApiProperty({
    example: '2025-03-27T04:23:35.480Z',
    description: 'Fecha de creación en formato ISO 8601',
  })
  createdAt: string; // También puedes usar `Date`

  @ApiProperty({ type: BusDto, description: 'Información del autobús' })
  Bus: BusDto;
}

export class UsedLastHourDto {
  @ApiProperty({
    type: CardUsedDto,
    description: 'Información de la tarjeta usada',
  })
  cardUsed: CardUsedDto;
}
