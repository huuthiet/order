import { Module } from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { MenuItemController } from './menu-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from './menu-item.entity';
import { MenuItemProfile } from './menu-item.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem])],
  controllers: [MenuItemController],
  providers: [MenuItemService, MenuItemProfile],
})
export class MenuItemModule {}
