import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { SecurityGuard } from './core/guards/security.guard';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { NotificationsModule } from './gateways/notifications/notifications.module';
import { StubsModule } from './features/stubs/stubs.module';
import { PelotasModule } from './features/pelotas/pelotas.module';
import { PartidosModule } from './features/partidos/partidos.module';
import { AnotacionesModule } from './features/anotaciones/anotaciones.module';
import { PosicionesEspacialesModule } from './features/posiciones-espaciales/posiciones-espaciales.module';
import { HabilidadesJugadorModule } from './features/habilidades-jugador/habilidades-jugador.module';
import { LocalidadesModule } from './features/localidades/localidades.module';
import { BoletosModule } from './features/boletos/boletos.module';
import { AficionadosModule } from './features/aficionados/aficionados.module';
import { AficionadosEquiposModule } from './features/aficionados-equipos/aficionados-equipos.module';
import { MetodosPagoAficionadoModule } from './features/metodos-pago-aficionado/metodos-pago-aficionado.module';
import { ApuestasModule } from './features/apuestas/apuestas.module';
import { TorneosDesarrolloModule } from './features/torneos-desarrollo/torneos-desarrollo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get<number>('DB_PORT', 3306)),
        username: config.get<string>('DB_USER', 'mostro'),
        password: config.get<string>('DB_PASS', '210910624Dj'),
        database: config.get<string>('DB_NAME', 'torneos_deportivos'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    NotificationsModule,
    StubsModule,
    PelotasModule,
    PartidosModule,
    AnotacionesModule,
    PosicionesEspacialesModule,
    HabilidadesJugadorModule,
    LocalidadesModule,
    BoletosModule,
    AficionadosModule,
    AficionadosEquiposModule,
    MetodosPagoAficionadoModule,
    ApuestasModule,
    TorneosDesarrolloModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SecurityGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
