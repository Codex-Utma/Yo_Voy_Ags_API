import { HttpException, Injectable } from '@nestjs/common';
import { RechargeRequestDto } from './dtos/request-recharge';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class TransactionsService {
  async recharge(rechargeData: RechargeRequestDto) {
    try {
      const { cardId, amount } = rechargeData;

      const isValidCardId = await this.ValidateCardId(cardId);
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

  private async ValidateCardId(cardId: number) {
    await prisma.card.findUnique({
      where: {
        id: cardId,
      },
    });
    if (!cardId) {
      return false;
    }
    return true;
  }

  private async UpdateBalance(cardId: number, amount: number): Promise<number> {
    const newBalance = await prisma.card.update({
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
    return Number(newBalance.balance);
  }
}
