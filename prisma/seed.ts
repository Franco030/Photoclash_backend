import { prisma } from '../src/config/database.js';

async function main() {
  console.log('Iniciando el seeder');

  await prisma.vote.deleteMany();
  await prisma.photoEntry.deleteMany();
  await prisma.tournament.deleteMany();
  await prisma.user.deleteMany();

  const user1 = await prisma.user.create({
    data: {
      username: 'usuario_alpha',
      title: 'Promesa',
      avatarUrl: 'https://ejemplo.com/avatar1.jpg',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'leyenda_urbana',
      title: 'Leyenda Urbana',
      score: 150,
      winRate: 75,
    },
  });

  const tournament = await prisma.tournament.create({
    data: {
      title: 'Torneo de Paisajes Nocturnos',
      description: 'Competencia semanal para las mejores fotos de la ciudad de noche.',
      status: 'active',
      coverImageUrl: 'https://ejemplo.com/cover.jpg',
      endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    }
  });

  await prisma.photoEntry.create({
    data: {
      tournamentId: tournament.id,
      authorId: user1.id,
      imageUrl: 'https://ejemplo.com/foto1.jpg',
    }
  });

  await prisma.photoEntry.create({
    data: {
      tournamentId: tournament.id,
      authorId: user2.id,
      imageUrl: 'https://ejemplo.com/foto2.jpg',
    },
  });

  console.log('Seeder se ejecuto correctamente. Base de datos poblada');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
