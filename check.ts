import { prisma } from './src/config/database.js';

async function main() {
    console.log("=== TOURNAMENTS ===");
    console.log(await prisma.tournament.findMany());
    
    console.log("=== PHOTOS ===");
    const photos = await prisma.photoEntry.findMany({
        orderBy: { submittedAt: 'desc' },
        take: 5
    });
    console.log(photos);
    
    console.log("=== USERS ===");
    const users = await prisma.user.findMany({ take: 5 });
    console.log(users);
}

main().catch(console.error).finally(() => prisma.$disconnect());
