import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateSecurityDto {
  @IsNotEmpty()
  @IsString()
  security_name: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}
