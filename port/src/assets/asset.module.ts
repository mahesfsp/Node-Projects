import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityDetail } from './security-detail.entity';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SecurityDetail])],
  providers: [AssetService],
  controllers: [AssetController],
})
export class AssetModule {}
