import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { BlogsService } from 'src/blogs/blogs.service';
import { CreateUserDto } from './dto/users.dto';
import { UserModel } from './Schemas/users.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UserModel.name) private UserModelInstance: Model<UserModel>,
        private blogsServiceInstance: BlogsService,
        private JwtServiceInstance: JwtService,
    ) { };

    //create a user
    async CreateUser(user: CreateUserDto) {
        try {
            console.log('service:', user);
            const hashPassword = await bcrypt.hash(user.password, 10);
            user.password = hashPassword;
            const data = new this.UserModelInstance(user);
            console.log('service:', await data.save());
            return true;
        }
        catch (e) {
            console.log(e);     
            return false;
        }
    }

    // retriving all users in DB
    async GetAllUsers() {
        try {
            const users = await this.UserModelInstance.find()
            if (users) return users
            return 'No users in record'
        }
        catch (e) {
            throw new alert("getall() have glitch")
        }
    }

    // delete all users
    DeleteAll() {

        return this.UserModelInstance.collection.drop()
    }

    //fetch user by username
    async FindUser(username: string) {
        try {
            const user = await this.UserModelInstance.findOne({ username }).populate('Blogs').exec();
            if (!user) {
                throw new NotFoundException(`${username} not found`)
            }
            return user;
        }
        catch (e) {
            throw new Error("find() have glitch")
        }
    }

    // delete one user using username
    async DeleteUser(username: string) {
        try {
            await this.blogsServiceInstance.deleteUserBlogs(username);
            await this.UserModelInstance.deleteOne({ username });
            return `${username} delete successfully`
        }
        catch (e) {
            throw new Error('deleteOne() have glitch')
        }
    }

    // updating the user
    async UpdateUser(username: string, user: any) {
        console.log(username, user);
        try {
            const olduser = await this.UserModelInstance.findOne({ username })
            if (olduser) {
                if (user.nickname) olduser.nickname = user.nickname;
                if (user.password) olduser.password = user.password;
                if (user.email) olduser.email = user.email;
                await olduser.save()
                return true
            }
        }
        catch (e) {
            return false;
        }
    }

    async validate(username: string, pswd: string) {
        try{
        const user:any = await this.UserModelInstance.findOne({username})
        console.log(user.username, await bcrypt.compare(pswd, user.password));
        if (user && await bcrypt.compare(pswd, user.password)) {
            const { password, ...result } = user;
            const payload = { id: user._id, username: user.username }
            const token = await this.JwtServiceInstance.sign(payload, { secret: 'secret' });
            return { "token": token, 'username': username, 'userId': user._id };
        }
        return false;}
      catch(e){
            return false;
        } 
     
    }

    async getNicknames() {
        const users= await this.UserModelInstance.find();
        console.log('getNicknames');
        
        const result:any=[];
        let obj:any;
        users.forEach((item) => {
            const obj={'username':item.username,'nickname':item.nickname}
            result.push(obj);
        })
        console.log(result);
        
        return result;
    }
}
