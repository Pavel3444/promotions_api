import express, {Express, NextFunction, Request, Response} from 'express';
import authRoutes from './routes/authRoutes';
import contentRoutes from './routes/contentRoutes';
import { PrismaClient } from '@prisma/client';

const app: Express = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/content', contentRoutes);
export {app, prisma};
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Internal Server Error' });
});

const startServer = async () => {
  try {
    await prisma.$connect();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

if (require.main === module) {
  startServer();
}
