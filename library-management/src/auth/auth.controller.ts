import { Body, Controller, Post ,Get} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { SigninCredentialsDto } from './dto/signin-credentials.dto';
import { Throttle } from '@nestjs/throttler';
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('/signup')
    signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }

 @Post('/signin')
signIn(@Body() signinCredentialsDto: SigninCredentialsDto): Promise<{ accessToken: string }> {
  return this.authService.signIn(signinCredentialsDto);
}


// @Throttle({ ttl: 60, limit: 2 })
// @Get('test-throttle')
// testThrottle() {
//   return 'Throttle working!';
// }
}
