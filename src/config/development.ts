import { registerAs } from '@nestjs/config';

export default registerAs('development', () => ({
  mongodbConnectionUrl: process.env.DEV_MONGODB_CONNECTION_URL,
}));
