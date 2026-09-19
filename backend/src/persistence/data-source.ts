import 'dotenv/config';
import { DataSource } from 'typeorm';

/**
 * DataSource usado por la CLI de TypeORM para generar y correr migraciones.
 * La aplicación usa la configuración de `persistence.module.ts`.
 */
export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [import.meta.dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [import.meta.dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
