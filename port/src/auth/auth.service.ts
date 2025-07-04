import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { SigninCredentialsDto } from './dto/signin-credentials.dto';
import { v4 as uuidv4 } from 'uuid';
import { DataSource } from 'typeorm';
import { AuditUserLogin } from './audit-user-login.entity';
import { UserLoginDetail } from './user-login-detail.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly UsersRepository: UsersRepository,
    private jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { first_name, password, role, email_address } = authCredentialsDto;

    await this.UsersRepository.createUser(authCredentialsDto);

    const user = await this.UsersRepository.findOne({
      where: { email_address },
    });

    if (user) {
      const loginDetail = new UserLoginDetail();
      loginDetail.user = user;
      loginDetail.first_name = first_name;
      loginDetail.last_name = '';
      loginDetail.email_address = email_address;
      loginDetail.user_status = 'ACTIVE';
      loginDetail.created_by = 'system';
      loginDetail.modified_by = 'system';

      await this.dataSource.getRepository(UserLoginDetail).save(loginDetail);
    }
  }

  async signIn(
    signinCredentialsDto: SigninCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email_address, password } = signinCredentialsDto;

    const user = await this.UsersRepository.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email_address = :email', { email: email_address })
      .getOne();

    const sessionId = uuidv4();
    const audit = new AuditUserLogin();
    audit.session_id = sessionId;
    audit.login_status = 'FAILED';

    let userLoginDetail: UserLoginDetail | null = null;

    if (user) {
      userLoginDetail = await this.dataSource
        .getRepository(UserLoginDetail)
        .findOne({
          where: { user: { id: user.id } },
          relations: ['user'],
        });
    }
    console.log('userLoginDetail', userLoginDetail);
    console.log('user', user);
    if (
      user &&
      userLoginDetail &&
      (await bcrypt.compare(password, user.password))
    ) {
      const payload: JwtPayload = { email_address };
      const accessToken = this.jwtService.sign(payload);
      audit.login_status = 'SUCCESS';
      audit.userLoginDetail = userLoginDetail;
      await this.dataSource.getRepository(AuditUserLogin).save(audit);
      return { accessToken };
    } else {
      if (userLoginDetail) {
        audit.userLoginDetail = userLoginDetail;
      }
      await this.dataSource.getRepository(AuditUserLogin).save(audit);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
