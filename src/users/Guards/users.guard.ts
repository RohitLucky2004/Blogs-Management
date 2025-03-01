import { CanActivate, ExecutionContext, Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersController } from '../users.controller';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from '../Schemas/users.schema';
import { Model } from 'mongoose';


@Injectable()
export class UsersGuard implements CanActivate {
  constructor(
    private JwtService: JwtService,
    @InjectModel(UserModel.name)private readonly userModel: Model<UserModel>
    ) {};

  async canActivate(context: ExecutionContext,): Promise<boolean> {
     console.log("User Guards:");
    const req = context.switchToHttp().getRequest()
    const head = req.headers.authorization;
    //console.log("head",head);
    const token=head.split(' ')[1];
    const data = await this.JwtService.verify(token,{secret:'secret'})
    console.log(`user data:`,data);
    const username = await this.userModel.findOne({ username: data.username });
    if (!username)
      throw new UnauthorizedException();
    req.params['user'] = data.username;
    req.params['id'] = data.sub;
    return true;
  }

}
