import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateSecurityDto } from './dto/create-security.dto';
import { SecurityDetail } from './security-detail.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/auth/user-role.enum';
import { Repository } from 'typeorm';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateSecurityDto): Promise<SecurityDetail> {
    return this.assetService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(): Promise<SecurityDetail[]> {
    return this.assetService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.assetService.remove(id);
  }
}
