import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
   env: process.env.NODE_DEV,
   port: process.env.PORT,
   database_url: process.env.DATABASE_URL,
   bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
   jwt: {
      secret_token: process.env.JWT_SECKRET_TOKEN,
      secret_expires: process.env.JWT_EXPIRE_IN,
      refresh_token: process.env.JWT_REFRESH_TOKEN,
      refresh_expires: process.env.JWT_REFRESH_EXPIRE_IN,
      activation_secret: process.env.ACTIVATION_SECRET,
   },
   smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      service: process.env.SMTP_SERVICE,
      mail: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
   },
   cloud: {
      name: process.env.CLOUD_NAME,
      key: process.env.CLOUD_KEY,
      seckret: process.env.CLOUD_SECKRET,
   },
   redis_url: process.env.REDIS_URL,
};
