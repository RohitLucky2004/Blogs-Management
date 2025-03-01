import { IsString, IsNotEmpty, IsOptional, IsEmpty, IsBoolean } from "class-validator";

export class SortDto {
    @IsOptional()
    createdAt: -1|1

    @IsOptional()
    isDeleted: -1|1
}
