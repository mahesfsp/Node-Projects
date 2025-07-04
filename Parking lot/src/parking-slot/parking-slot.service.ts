import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParkingSlot } from './parking-slot.entity';
import { CreateParkingSlotDto } from './dto/create-parking-slot.dto';
import { UpdateParkingSlotDto } from './dto/update-parking-slot.dto';

@Injectable()
export class ParkingSlotService {
  constructor(
    @InjectRepository(ParkingSlot)
    private repo: Repository<ParkingSlot>,
  ) {}

  async create(dto: CreateParkingSlotDto) {
    const slot = this.repo.create(dto);
    try {
      return await this.repo.save(slot);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Slot number already exists');
      }
      throw error;
    }
  }
  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Slot not found');
    return found;
  }

  async update(id: string, dto: UpdateParkingSlotDto) {
    const slot = await this.findOne(id);
    Object.assign(slot, dto);
    return this.repo.save(slot);
  }

  async remove(id: string) {
    const slot = await this.findOne(id);
    return this.repo.remove(slot);
  }

  async findAvailable() {
    return this.repo.find({ where: { isAvailable: true } });
  }
}
