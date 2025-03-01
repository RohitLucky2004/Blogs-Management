import { IsNotEmpty, IsString, IsStrongPassword, IsEmail, ValidateNested, IsOptional, } from 'class-validator'
import { Type } from 'class-transformer';
import { BlogDto } from 'src/blogs/dtos/blogs.dto';
import { ObjectId } from 'mongoose';
export class CreateUserDto {
    @IsString()
    nickname:string

    @IsNotEmpty()
    @IsString()
    username: string

    @IsStrongPassword()
    password: string

    @IsEmail()
    email: string

    @IsOptional()
    @ValidateNested()
    @Type(() => BlogDto)
    Blogs: ObjectId[]
}