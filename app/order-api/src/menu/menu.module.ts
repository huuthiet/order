import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { Branch } from 'src/branch/branch.entity';
import { MenuProfile } from './menu.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Branch])],
  controllers: [MenuController],
  providers: [MenuService, MenuProfile],
})
export class MenuModule {}
