import { DataSource } from 'typeorm';
import 'dotenv/config';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'mostro',
  password: process.env.DB_PASS || 'API',
  database: process.env.DB_NAME || '210910624Dj',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});

export default dataSource;
