import { IsString, IsNotEmpty, IsOptional, IsEmpty } from "class-validator";
import { StreamPriorityOptions } from "http2";

export class BlogDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsOptional()
    description: {
        textId:string,
        content:string,
        formated:string
    }[]

    @IsOptional()
    category: string

    @IsString()
    @IsOptional()
    username:string

    @IsOptional()
    likes:number;

    @IsOptional()
    updatedAt:Date

    @IsOptional()
    isDeleted:boolean
}