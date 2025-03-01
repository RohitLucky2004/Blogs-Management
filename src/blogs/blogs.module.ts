import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, userSchema } from 'src/users/Schemas/users.schema';
import { BlogModel, blogSchema } from './schemas/blog.schema';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.name, schema: userSchema },
      { name: BlogModel.name, schema: blogSchema }
    ]),UsersModule],
  controllers: [BlogsController],
  providers: [BlogsService, UsersService, JwtService]
})
export class BlogsModule { }
