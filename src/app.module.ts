import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TagModule } from '@app/tag/tag.module';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '@app/user/user.module';
import { ArticleModule } from '@app/article/article.module';
import { AuthMiddleware } from '@app/user/middlewares/auth.middleware';
import { ProfileModule } from '@app/profile/profile.module';
import { CommentModule } from '@app/comment/comment.module';

// Reference: https://github.com/crazyoptimist/nest-starter

@Module({
  imports: [

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
          return {
            type: configService.get('DB_TYPE'),
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE'),
            entities: [__dirname + '/**/*.entity{.ts, .js}'],
            synchronize: configService.get('DB_SYNC') === 'true',
            keepConnectionAlive: true,
        } as TypeOrmModuleAsyncOptions;
      }
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TagModule,
    UserModule,
    ArticleModule,
    ProfileModule,
    CommentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // Register middleware
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthMiddleware).forRoutes({
          path: '*',
          method: RequestMethod.ALL
      })
  }

}
