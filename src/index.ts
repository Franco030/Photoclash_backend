import express from 'express';
import tournamentRoutes from './routes/tournament.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();
app.set('trust proxy', 1);

import path from 'path';

app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/v1/tournaments', tournamentRoutes);
app.use('/api/v1/users', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
