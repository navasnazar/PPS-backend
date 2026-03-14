import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateProjectDto {

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsDateString()
    targetDate?: string;

}