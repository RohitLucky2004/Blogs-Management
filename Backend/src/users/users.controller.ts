import { Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards, UsePipes, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { SignInDto } from './dto/signIn.dto';
import { CreateUserDto } from './dto/users.dto';
import { UsersGuard } from './Guards/users.guard';
import { UsersService } from './users.service';
import { updateUserDTO } from './dto/updateUserDto.dto';

@Controller('user')
export class UsersController {
    constructor(
        private UserServiceInstance: UsersService,
    ) { };
    // creating a user
    @Post('signUp')
    @UsePipes(new ValidationPipe())
    CreateUser(@Body() user:CreateUserDto) {
            return this.UserServiceInstance.CreateUser(user);
    }

    // login
    @Post('login')
    async login(@Body() data:SignInDto){
        return await this.UserServiceInstance.validate(data.username,data.password);
    }
    // updating user details
    @Put('update')
    @UseGuards(UsersGuard)
    update(@Param() params, @Body() user: any) {
        return this.UserServiceInstance.UpdateUser(params.user, user);
    }

    // fetch all users
    @Get('all')
     @UseGuards(UsersGuard)
    GetUsers() {
        return this.UserServiceInstance.GetAllUsers();
    }

    // fetch a user by username
    @Get('find\:username')
    // @UseGuards(UsersGuard)
    findOne(@Param() params) {
        return this.UserServiceInstance.FindUser(params.username);
    }

    @Get('nicknames')
    getNickname(){
        return this.UserServiceInstance.getNicknames()
    }
    //user profile
    @Get('profile/:username')
    @UseGuards(UsersGuard)
    async profile(@Param() param) {
        // try {     
            const user = await this.UserServiceInstance.FindUser(param.username)
            return user;
        // }
        // catch (e) {
        //     return "session expired"
        // }
    }

    // delete data in db
    @Delete('drop')
    // @UseGuards(UsersGuard)
    DeleteAll() {
        return this.UserServiceInstance.DeleteAll();
    }

    // delete one user 
    @Delete()
    // @UseGuards(UsersGuard)
    DeleteUser(@Param() params) {
        return this.UserServiceInstance.DeleteUser(params.user);
    }

}
