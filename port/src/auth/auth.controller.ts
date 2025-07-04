import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { SigninCredentialsDto } from './dto/signin-credentials.dto';
import { Throttle } from '@nestjs/throttler';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from './user-role.enum';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
  ) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body() signinCredentialsDto: SigninCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(signinCredentialsDto);
  }

  @ApiTags('Users')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('/users')
  @ApiOkResponse({ description: 'Returns all users if admin', type: [User] })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  @ApiForbiddenResponse({ description: 'Access denied. Admin only' })
  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // @Throttle({ ttl: 60, limit: 2 })
  // @Get('test-throttle')
  // testThrottle() {
  //   return 'Throttle working!';
  // }
}
