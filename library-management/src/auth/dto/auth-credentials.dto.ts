import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
  IsEmail,
} from 'class-validator';
import { UserRole } from '../user-role.enum'; 

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must include uppercase, lowercase, number, and special character',
    },
  )
  password: string;

  @IsEnum(UserRole, { message: 'Role must be either ADMIN or USER' })
  role: UserRole;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
