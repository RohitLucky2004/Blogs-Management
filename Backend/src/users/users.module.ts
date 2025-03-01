import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModel, blogSchema } from 'src/blogs/schemas/blog.schema';
import { BlogsService } from 'src/blogs/blogs.service';
import { UsersController } from './users.controller';
import { UserModel, userSchema } from './Schemas/users.schema';
import { UsersService } from './users.service';


@Module({
  imports:[
    MongooseModule.forFeature([
    {name:UserModel.name,schema:userSchema},
    {name:BlogModel.name,schema:blogSchema}]),

    JwtModule.register({
      secret:'secret',
      signOptions: { expiresIn: '1h' },})
    ],
  controllers: [UsersController],
  providers: [UsersService, BlogsService,JwtService]
})
export class UsersModule {}
