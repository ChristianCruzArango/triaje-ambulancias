import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        url: config.getOrThrow<string>('database.url'),
        autoLoadEntities: true,
        // En desarrollo se sincroniza el esquema; en producción se usan migraciones.
        synchronize: config.get<string>('nodeEnv') === 'development',
        migrations: [import.meta.dirname + '/migrations/*{.ts,.js}'],
        // Fuera de desarrollo, las migraciones pendientes se aplican al arrancar.
        migrationsRun: config.get<string>('nodeEnv') !== 'development',
        logging: false,
      }),
    }),
  ],
})
export class PersistenceModule {}
