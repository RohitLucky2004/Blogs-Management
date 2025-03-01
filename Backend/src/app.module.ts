import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from './blogs/blogs.module';
import configuration from './configuration';
import { UsersModule } from './users/users.module';


@Module({
  imports: [UsersModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => configService.get('MONGODB_CONFIG'),
      inject: [ConfigService],
    }),
    JwtModule.register({
      secret:'secret',
      signOptions: { expiresIn: '1h' },
    }),
    BlogsModule, UsersModule
  ],
 
})
export class AppModule { }
