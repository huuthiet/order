import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { TableProfile } from './table.mapper';
import { Table } from './table.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from 'src/branch/branch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Table, Branch])],
  controllers: [TableController],
  providers: [TableService, TableProfile],
})
export class TableModule {}
