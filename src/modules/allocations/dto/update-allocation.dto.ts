import { IsOptional, IsNumber } from 'class-validator';

export class UpdateAllocationDto {

    @IsOptional()
    @IsNumber()
    allocationPercentage?: number;

}