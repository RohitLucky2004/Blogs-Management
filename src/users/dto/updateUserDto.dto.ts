import { IsNotEmpty, IsString, IsStrongPassword, IsEmail, ValidateNested, IsOptional, } from 'class-validator'
import { Type } from 'class-transformer';
import { BlogDto } from 'src/blogs/dtos/blogs.dto';
import { ObjectId } from 'mongoose';
export class updateUserDTO {
    @IsString()
    @IsOptional()
    nickname:string

    @IsOptional()
    @IsStrongPassword()
    password: string
    @IsOptional()
    @IsEmail()
    email: string

    @IsOptional()
    @ValidateNested()
    @Type(() => BlogDto)
    Blogs: ObjectId[]
}