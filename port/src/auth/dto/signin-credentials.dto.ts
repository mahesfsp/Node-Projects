import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEmail,
} from 'class-validator';

export class SigninCredentialsDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email_address: string;

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
}
