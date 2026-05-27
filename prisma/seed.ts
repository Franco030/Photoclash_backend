import { prisma } from '../src/config/database.js';

async function main() {
  console.log('Seeding database with default tournaments...');

  const tournaments: any[] = [
    {
      title: 'Fotografía Nocturna Urbana',
      description: 'Captura la esencia de la ciudad bajo las luces de neón y las farolas.',
      status: 'active',
      coverImageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500&h=300&fit=crop',
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 days from now
    },
    {
      title: 'Retratos en Blanco y Negro',
      description: 'Muestra la profundidad de las emociones sin usar colores.',
      status: 'active',
      coverImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=300&fit=crop',
      endDate: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 days from now
    },
    {
      title: 'Arquitectura Minimalista',
      description: 'Encuentra líneas limpias y simetría en tu entorno urbano.',
      status: 'active',
      coverImageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&h=300&fit=crop',
      endDate: new Date(new Date().setDate(new Date().getDate() + 10)), // 10 days from now
    }
  ];

  for (const t of tournaments) {
    await prisma.tournament.create({
      data: t
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
