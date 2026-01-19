import { TypeOrmModule } from '@nestjs/typeorm';
import { InjectionToken } from '@nestjs/common/interfaces/modules/injection-token.interface';
import { Type, Global, Module, Provider, DynamicModule, ModuleMetadata } from '@nestjs/common';
import { OptionalFactoryDependency } from '@nestjs/common/interfaces/modules/optional-factory-dependency.interface';

import { UserEntity } from './entities/user.entity';
import { AuthSessionEntity } from './entities/auth-session.entity';

export interface DatabaseModuleOptions {
  host: string;
  port: number;
  name: string;
  username: string;
  password: string;
  poolSize?: number;
  maxUses?: number;
  rejectUnauthorized?: boolean;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
  sslEnabled?: boolean;
  ca?: string;
  key?: string;
  cert?: string;
}

interface DatabaseOptionsFactory {
  createSearchOptions(): Promise<DatabaseModuleOptions> | DatabaseModuleOptions;
}

interface DatabaseModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: Array<InjectionToken | OptionalFactoryDependency>;
  useClass?: Type<DatabaseOptionsFactory>;
  useExisting?: Type<DatabaseOptionsFactory>;
  useFactory?: (...args: unknown[]) => Promise<DatabaseModuleOptions> | DatabaseModuleOptions;
}

@Global()
@Module({})
export class DatabaseModule {
  public static forRootAsync(options: DatabaseModuleAsyncOptions): DynamicModule {
    const providers: Provider[] = this.createAsyncProviders(options);

    return {
      module: DatabaseModule,
      imports: [
        ...(options.imports ?? []),
        TypeOrmModule.forRootAsync({
          inject: ['DB_CONFIG_OPTIONS'],
          useFactory: (config: DatabaseModuleOptions) => ({
            type: 'postgres',
            host: config.host,
            port: config.port,
            username: config.username,
            password: config.password,
            database: config.name,
            dropSchema: false,
            keepConnectionAlive: true,
            logging: false,
            logger: 'advanced-console',
            entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
            migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
            migrationsTableName: 'each',
            poolSize: config.poolSize,
            extra: {
              max: config.poolSize, // based on https://node-postgres.com/apis/pool
              idleTimeoutMillis: config.idleTimeoutMillis || 30000, // how long a client is allowed to remain idle before being closed
              connectionTimeoutMillis: config.connectionTimeoutMillis || 2000, // how long to wait for a connection from the pool
              maxUses: config.maxUses || 7500, // max number of clients the pool should contain
              ssl: config.sslEnabled
                ? {
                    rejectUnauthorized: config.rejectUnauthorized,
                    ca: config.ca,
                    key: config.key,
                    cert: config.cert,
                  }
                : undefined,
            },
          }),
        }),
      ],
      providers: [...providers, AuthSessionEntity, UserEntity],
      exports: ['DB_CONFIG_OPTIONS'],
    };
  }

  private static createAsyncProviders(options: DatabaseModuleAsyncOptions): Provider[] {
    const providers: Provider[] = [this.createAsyncOptionsProvider(options)];

    if (options.useClass) {
      providers.push({ provide: options.useClass, useClass: options.useClass });
    }

    return providers;
  }

  private static createAsyncOptionsProvider(options: DatabaseModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: 'DB_CONFIG_OPTIONS',
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: 'DB_CONFIG_OPTIONS',
      useFactory: async (optionsFactory: DatabaseOptionsFactory) => {
        return optionsFactory.createSearchOptions();
      },
      inject: [options.useExisting! || options.useClass!],
    };
  }
}
