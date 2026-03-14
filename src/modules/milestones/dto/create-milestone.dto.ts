import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateMilestoneDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsMongoId()
  projectId: string;

  @IsOptional()
  @IsString()
  priority?: string;
}
