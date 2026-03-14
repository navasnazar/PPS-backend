import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class UpdateMilestoneDto {

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsNumber()
    progress?: number;

    @IsOptional()
    @IsDateString()
    deadline?: string;

}