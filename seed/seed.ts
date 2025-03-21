import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDb() {
  try {
    await prisma.cardType.createMany({
      data: [
        {
          name: 'Preferencial',
          description: 'Tarjeta de prepago preferencial',
        },
        {
          name: 'Común',
          description: 'Tarjeta de prepago común',
        },
      ],
    });

    await prisma.card.createMany({
      data: [
        {
          id: 12345678,
          serialNumber: '1A-2B-3C-4D',
          balance: 0,
          cardTypeId: 1,
          isPreferential: true,
        },
        {
          id: 87654321,
          serialNumber: '5E-6F-7G-8H',
          balance: 0,
          cardTypeId: 2,
          isPreferential: false,
        },
      ],
    });

    await prisma.route.createMany({
      data: [
        {
          name: 'Ruta 20',
        },
        {
          name: 'Ruta 40',
        },
        {
          name: 'Ruta 50',
        },
      ],
    });

    await prisma.bus.createMany({
      data: [
        {
          id: 1234,
          routeId: 1,
        },
        {
          id: 5678,
          routeId: 2,
        },
        {
          id: 9012,
          routeId: 3,
        },
      ],
    });
  } catch (error) {
    console.error(error);
    throw new Error('Internal server error');
  }
}

seedDb();
