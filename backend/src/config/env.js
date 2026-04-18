// src/config/env.js
// Validates all required environment variables at startup.
import { cleanEnv, str, port } from 'envalid';

const env = cleanEnv(process.env, {
  PORT:                port({ default: 3001 }),
  NODE_ENV:           str({ choices: ['development', 'test', 'production'], default: 'development' }),
  JWT_ACCESS_SECRET:  str(),
  JWT_REFRESH_SECRET: str(),
  JWT_ACCESS_EXPIRES: str({ default: '15m' }),
  JWT_REFRESH_EXPIRES: str({ default: '7d' }),
  FRONTEND_URL:       str({ default: 'http://localhost:5173' }),
  UPLOAD_DIR:         str({ default: './uploads' }),
});

export default env;
