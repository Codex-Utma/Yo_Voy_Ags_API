import { HttpException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class TransfersService {
  async getCardData(cardId: string) {
    try {
      const cardData = await this.validateCardId(cardId);
      if (!cardData) {
        throw new HttpException('Invalid card ID', 400);
      }
      const cardUsed = await prisma.transfer.findFirst({
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          AND: [
            {
              cardId: Number(cardId),
            },
            {
              createdAt: {
                gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 2), // Últimas 2 horas
              },
            },
          ],
        },
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
          createdAt: true,
        },
      });
      if (!cardUsed) {
        throw new HttpException('Card not used in the last 2 hours', 404);
      }

      const updatedDate = new Date(cardUsed.createdAt);
      updatedDate.setHours(updatedDate.getHours() + 6);

      const response = {
        busData: {
          id: cardUsed.Bus.id,
          route: cardUsed.Bus.Route.name,
        },
        lastUsed: updatedDate,
      };
      return {
        message: 'Data found',
        data: response,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', 500);
    }
  }

  private async validateCardId(cardId: string): Promise<number | undefined> {
    const cardData = await prisma.card.findUnique({
      where: {
        id: Number(cardId),
      },
      select: {
        id: true,
      },
    });
    return cardData?.id;
  }
}
