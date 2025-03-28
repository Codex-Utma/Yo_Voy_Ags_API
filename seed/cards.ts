import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDb() {
  try {
    await prisma.card.createMany({
      data: [
        {
          id: 5140396,
          serialNumber: '04 5E 9D FA 33 1D 90',
          balance: 50,
          cardTypeId: 2,
          isPreferential: false,
        },
        {
          id: 10044478,
          serialNumber: '04 52 7F E2 34 1D 90',
          balance: 50,
          cardTypeId: 1,
          isPreferential: true,
        },
        {
          id: 10044693,
          serialNumber: '04 9A 2C E2 34 1D 90',
          balance: 50,
          cardTypeId: 1,
          isPreferential: true,
        },
      ],
    });
  } catch (error) {
    console.error(error);
    throw new Error('Internal server error');
  }
}

seedDb();
