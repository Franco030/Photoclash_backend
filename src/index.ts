import express from 'express';
import tournamentRoutes from './routes/tournament.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(express.json());

app.use('/api/tournaments', tournamentRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
