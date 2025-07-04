import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ParkingSlotService } from './parking-slot.service';
import { CreateParkingSlotDto } from './dto/create-parking-slot.dto';
import { UpdateParkingSlotDto } from './dto/update-parking-slot.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/auth/user-role.enum';

@Controller('parking-slots')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ParkingSlotController {
  constructor(private readonly parkingSlotService: ParkingSlotService) {}

  // ✅ Admin-only: Create slot
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createDto: CreateParkingSlotDto) {
    return this.parkingSlotService.create(createDto);
  }

  // ✅ Admin & User: View all slots
  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  findAll() {
    return this.parkingSlotService.findAll();
  }

  // ✅ Admin & User: View one slot
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findOne(@Param('id') id: string) {
    return this.parkingSlotService.findOne(id);
  }

  // ✅ Admin-only: Update slot
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateDto: UpdateParkingSlotDto) {
    return this.parkingSlotService.update(id, updateDto);
  }

  // ✅ Admin-only: Delete slot
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.parkingSlotService.remove(id);
  }

  @Get('available')
  @Roles(UserRole.USER, UserRole.ADMIN)
  getAvailable() {
    return this.parkingSlotService.findAvailable();
  }
}
