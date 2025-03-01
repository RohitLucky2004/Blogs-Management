import { IsString, IsNotEmpty, IsOptional, IsEmpty, IsBoolean } from "class-validator";

export class QueryDto {
    @IsString()
    @IsOptional()
    username: string

    @IsBoolean()
    isDeleted: boolean
}
