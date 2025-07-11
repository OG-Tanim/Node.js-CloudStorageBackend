import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';

const start = async () => {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(`Server is running on port ${env.port} in ${env.nodeEnv} mode`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
};

start();
