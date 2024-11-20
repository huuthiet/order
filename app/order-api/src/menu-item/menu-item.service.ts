import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuItem } from './menu-item.entity';
import { Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  CreateMenuItemDto,
  MenuItemResponseDto,
  UpdateMenuItemDto,
} from './menu-item.dto';
import { Menu } from 'src/menu/menu.entity';
import { Product } from 'src/product/product.entity';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectMapper() private readonly mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  async bulkCreate(
    createMenuItemDto: CreateMenuItemDto[],
  ): Promise<MenuItemResponseDto[]> {
    let menuItems: MenuItem[] = [];

    for (const menuItemDto of createMenuItemDto) {
      const product = await this.productRepository.findOne({
        where: { slug: menuItemDto.productSlug },
      });
      if (!product) throw new Error('Product not found');

      const menu = await this.menuRepository.findOne({
        where: { slug: menuItemDto.menuSlug },
      });
      if (!menu) throw new Error('Menu not found');

      const menuItem = this.mapper.map(
        menuItemDto,
        CreateMenuItemDto,
        MenuItem,
      );
      Object.assign(menuItem, { product, menu });

      menuItems.push(menuItem);
    }
    await this.menuRepository.manager.transaction(async (manager) => {
      await manager.insert(MenuItem, menuItems);
    });
    this.logger.log(`Menu items created: ${menuItems.map((m) => m.id)}`);

    return this.mapper.mapArray(menuItems, MenuItem, MenuItemResponseDto);
  }

  async create(createMenuItemDto: CreateMenuItemDto) {
    const product = await this.productRepository.findOne({
      where: { slug: createMenuItemDto.productSlug },
    });
    if (!product) throw new Error('Product not found');

    const menu = await this.menuRepository.findOne({
      where: { slug: createMenuItemDto.menuSlug },
    });
    if (!menu) throw new Error('Menu not found');

    const menuItem = this.mapper.map(
      createMenuItemDto,
      CreateMenuItemDto,
      MenuItem,
    );
    Object.assign(menuItem, { product, menu });

    this.menuItemRepository.create(menuItem);
    const createdMenuItem = await this.menuItemRepository.save(menuItem);
    this.logger.log(`Menu item created: ${createdMenuItem.id}`);

    return this.mapper.map(createdMenuItem, MenuItem, MenuItemResponseDto);
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
