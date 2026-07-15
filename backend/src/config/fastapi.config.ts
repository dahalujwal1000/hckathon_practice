import { registerAs } from '@nestjs/config';

export default registerAs('fastapi', () => ({
  url: process.env.FASTAPI_URL,
  internalToken: process.env.FASTAPI_INTERNAL_TOKEN,
}));
