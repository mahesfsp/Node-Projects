import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { SigninCredentialsDto } from './dto/signin-credentials.dto';
@Injectable()
export class AuthService {

    constructor(private readonly UsersRepository: UsersRepository,
        private jwtService: JwtService,
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.UsersRepository.createUser(authCredentialsDto);
    }


    async signIn(signinCredentialsDto: SigninCredentialsDto): Promise<{ accessToken: string }> {
        const { username, password } = signinCredentialsDto;
        const user = await this.UsersRepository.findOne({ where: { username } });
        if (user && await bcrypt.compare(password, user.password)) {
            const payload: JwtPayload = { username };
            const accessToken: string = this.jwtService.sign(payload);
            return { accessToken };
        }
        else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }
}
