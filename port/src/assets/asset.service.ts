import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityDetail } from './security-detail.entity';
import { CreateSecurityDto } from './dto/create-security.dto';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(SecurityDetail)
    private assetRepo: Repository<SecurityDetail>,
  ) {}

  async create(dto: CreateSecurityDto): Promise<SecurityDetail> {
    const asset = this.assetRepo.create(dto);
    return this.assetRepo.save(asset);
  }
  async findAll(): Promise<SecurityDetail[]> {
    return this.assetRepo.find();
  }
  async remove(id: number): Promise<void> {
    await this.assetRepo.delete(id);
  }
}
