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
          serialNumber: 'E9 6F F9 B1',
          balance: 0,
          cardTypeId: 1,
          isPreferential: true,
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
          routeId: 1,
        },
        {
          id: 9012,
          routeId: 1,
        },
        {
          id: 4321,
          routeId: 2,
        },
        {
          id: 8765,
          routeId: 2,
        },
        {
          id: 2109,
          routeId: 2,
        },
        {
          id: 1111,
          routeId: 3,
        },
        {
          id: 2222,
          routeId: 3,
        },
        {
          id: 3333,
          routeId: 3,
        },
      ],
    });
    await prisma.reportType.createMany({
      data: [
        {
          name: 'Objecto extraviado',

        },
        {
          name: 'Comportamiento inapropiado del conductor',
        },
        {
          name: 'Estado de la unidad',
        }
      ]
    });
  } catch (error) {
    console.error(error);
    throw new Error('Internal server error');
  }
}

seedDb();
