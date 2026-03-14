import { IsEmail, IsString } from 'class-validator';

export class RegisterAdminDto {
  @IsString()
  organizationName: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
