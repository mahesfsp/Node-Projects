import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): User => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);