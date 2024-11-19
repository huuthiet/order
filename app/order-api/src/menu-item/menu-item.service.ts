import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuItem } from './menu-item.entity';
import { Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectMapper() private readonly mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(createMenuItemDto: CreateMenuItemDto) {
    return 'This action adds a new menuItem';
  }

  findAll() {
    return `This action returns all menuItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} menuItem`;
  }

  update(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    return `This action updates a #${id} menuItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} menuItem`;
  }
}
