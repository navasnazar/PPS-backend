import { IsMongoId, IsNumber, Max, Min } from 'class-validator';

export class CreateAllocationDto {
  @IsMongoId()
  userId: string;

  @IsMongoId()
  milestoneId: string;

  @IsMongoId()
  projectId: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  allocationPercentage: number;
}
