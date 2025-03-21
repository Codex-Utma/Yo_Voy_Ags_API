import { HttpException, Injectable } from '@nestjs/common';
import { RechargeRequestDto } from './dtos/request-recharge';
import { PrismaClient } from '@prisma/client';
import { UseRequestDto } from './dtos/request-use';

const prisma = new PrismaClient();

@Injectable()
export class TransactionsService {
  async recharge(rechargeData: RechargeRequestDto) {
    try {
      const { cardId, amount } = rechargeData;

      const isValidCardId = await this.ValidateCard(cardId);
      if (!isValidCardId) {
        throw new HttpException('Invalid card id', 400);
      }
      const newBalance = await this.UpdateBalance(cardId, amount);
      await prisma.transaction.create({
        data: {
          cardId,
          amount,
        },
      });
      return {
        message: 'Recharge successful',
        newBalance,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', 500);
    }
  }

  async cardUse(useData: UseRequestDto) {
    try {
      const { cardSerial, busId, latitude, longitude } = useData;

      const cardId = await this.ValidateCard(undefined, cardSerial);
      if (!cardId) {
        throw new HttpException('Invalid serial card', 400);
      }

      const newBalance = await this.UpdateBalance(cardId, -10.5);
      await prisma.transaction.create({
        data: {
          cardId,
          amount: -10.5,
        },
      });

      await prisma.transfer.create({
        data: {
          cardId,
          busId,
          location: {
            latitude,
            longitude,
          },
        },
      });

      return {
        message: 'Use successful',
        newBalance,
        date: new Date().toLocaleTimeString('es-MX', { hour12: false }),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', 500);
    }
  }

  private async ValidateCard(
    cardId?: number,
    cardSerial?: string,
  ): Promise<number> {
    const card = await prisma.card.findFirst({
      where: {
        OR: [
          {
            id: cardId,
          },
          {
            serialNumber: cardSerial,
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (!card) {
      return 0;
    }
    return card.id;
  }
  private async UpdateBalance(cardId: number, amount: number): Promise<number> {
    if (amount < 0) {
      const card = await prisma.card.findFirst({
        where: {
          id: cardId,
          balance: {
            lte: 10.5,
          },
        },
      });
      if (card) {
        throw new HttpException('Insufficient balance', 400);
      }
    }
    const cardUpdated = await prisma.card.update({
      where: {
        id: cardId,
      },
      data: {
        balance: {
          increment: amount,
        },
      },
      select: {
        balance: true,
      },
    });
    return Number(cardUpdated.balance);
  }
}
