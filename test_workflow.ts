import { prisma } from './src/config/database.js';
import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

async function run() {
  try {
    console.log("=== Limpiando BD ===");
    await prisma.vote.deleteMany();
    await prisma.photoEntry.deleteMany();
    await prisma.tournament.deleteMany();
    await prisma.user.deleteMany();

    console.log("=== Creando Usuario ===");
    const user = await prisma.user.create({
      data: {
        id: 'test-user-id',
        username: '@tester',
        title: 'Tester'
      }
    });
    console.log("User creado:", user.id);

    console.log("=== Creando Torneo ===");
    const tournament = await prisma.tournament.create({
      data: {
        id: 'test-tournament-id',
        title: 'Torneo de Prueba',
        description: 'Test',
        coverImageUrl: 'http://example.com/cover.jpg',
        endDate: new Date(Date.now() + 86400000),
        status: 'active'
      }
    });
    console.log("Torneo creado:", tournament.id);

    console.log("=== Simulando Subida (Participate) ===");
    // Creamos una imagen dummy
    const dummyPath = path.join(process.cwd(), 'dummy.jpg');
    fs.writeFileSync(dummyPath, 'fake image data');

    const form = new FormData();
    form.append('image', fs.createReadStream(dummyPath));

    const uploadRes = await fetch(`http://localhost:3000/api/v1/tournaments/${tournament.id}/participate`, {
      method: 'POST',
      headers: {
        'x-user-id': user.id,
        ...form.getHeaders()
      },
      body: form
    });

    const uploadData = await uploadRes.json();
    console.log("Upload Status:", uploadRes.status);
    console.log("Upload Response:", uploadData);

    console.log("=== Verificando DB ===");
    const photos = await prisma.photoEntry.findMany();
    console.log("Fotos en DB:", photos);

    console.log("=== Probando Dashboard Endpoint ===");
    const dashboardRes = await fetch(`http://localhost:3000/api/v1/users/me/dashboard`, {
      headers: {
        'x-user-id': user.id
      }
    });

    const dashboardData = await dashboardRes.json();
    console.log("Dashboard Status:", dashboardRes.status);
    console.log("Dashboard Response:", JSON.stringify(dashboardData, null, 2));

  } catch (error) {
    console.error("ERROR CRITICO:", error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
