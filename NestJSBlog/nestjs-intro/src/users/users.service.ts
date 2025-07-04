import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto } from './dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserRepository) private repo: UserRepository) {}

  create(dto: CreateUserDto) {
    const user = this.repo.create(dto);
    return this.repo.save(user);
  }

  findAll(pagination: PaginationDto) {
    const { page, limit } = pagination;
    return this.repo.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['posts'],
    });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['posts'] });
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.repo.update(id, dto);
    return this.repo.findOne(id);
  }

  delete(id: number) {
    return this.repo.delete(id);
  }
}
