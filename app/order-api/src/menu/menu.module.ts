import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { Branch } from 'src/branch/branch.entity';
import { MenuProfile } from './menu.mapper';
import { ACBConnectorModule } from 'src/acb-connector/acb-connector.module';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Branch]), ACBConnectorModule],
  controllers: [MenuController],
  providers: [MenuService, MenuProfile],
})
export class MenuModule {}
