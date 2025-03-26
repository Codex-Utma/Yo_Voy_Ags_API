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
      const newBalance = await this.UpdateBalance(
        isValidCardId.cardId,
        amount,
        isValidCardId.isPreferential,
      );
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

      const card = await this.ValidateCard(undefined, cardSerial);
      if (!card) {
        throw new HttpException('Invalid serial card', 400);
      }

      const newBalance = await this.UpdateBalance(
        card.cardId,
        card.isPreferential ? -5.25 : -10.5,
        card.isPreferential,
      );

      const newTransfer = await prisma.transfer.create({
        data: {
          cardId: card.cardId,
          busId,
          location: {
            latitude,
            longitude,
          },
        },
      });

      await prisma.transaction.create({
        data: {
          cardId: card.cardId,
          amount: card.isPreferential ? -5.25 : -10.5,
          transferId: newTransfer.id,
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

  async getCardData(cardId: string) {
    try {
      const cardData = await this.ValidateCard(Number(cardId));
      if (!cardData) {
        throw new HttpException('Invalid card id', 400);
      }
      const cardUses = await prisma.transaction.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          cardId: cardData.cardId,
        },
        select: {
          amount: true,
          createdAt: true,
          Transfer: {
            select: {
              Bus: {
                select: {
                  id: true,
                  Route: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
        take: 10,
      });

      const updatedCardUses = cardUses.map((use) => ({
        ...use,
        createdAt: new Date(use.createdAt.getTime() + 6 * 60 * 60 * 1000),
      }));

      const response = {
        cardData: {
          cardId: cardData.cardId,
          balance: cardData.balance,
          isPreferential: cardData.isPreferential,
          cardUses: updatedCardUses,
        },
      };

      return { response };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', 500);
    }
  }

  async getUsedLastHour(cardId: number) {
    try {
      const ValidateCard = await this.ValidateCard(cardId);
      if (!ValidateCard) {
        throw new HttpException('Invalid card ID', 400);
      }
      const cardUsed = await prisma.transfer.findFirst({
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          cardId,
          createdAt: {
            gt: new Date(new Date().getTime() - 60 * 60 * 1000),
          },
        },
        select: {
          createdAt: true,
          Bus: {
            select: {
              id: true,
              Route: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!cardUsed) {
        throw new HttpException('No card used in the last hour', 400);
      }

      const updatedCardUsed = {
        ...cardUsed,
        createdAt: new Date(cardUsed.createdAt.getTime() + 6 * 60 * 60 * 1000),
      };

      return {
        cardUsed: updatedCardUsed,
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
  ): Promise<{ cardId: number; isPreferential: boolean; balance: number } | 0> {
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
        isPreferential: true,
        balance: true,
      },
    });

    if (!card) {
      return 0;
    }

    const cardData = {
      cardId: card.id,
      isPreferential: card.isPreferential,
      balance: Number(card.balance),
    };

    return cardData;
  }
  private async UpdateBalance(
    cardId: number,
    amount: number,
    isPreferential: boolean,
  ): Promise<number> {
    if (amount < 0) {
      const card = await prisma.card.findFirst({
        where: {
          id: cardId,
          balance: {
            lte: isPreferential ? 5.25 : 10.5,
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
