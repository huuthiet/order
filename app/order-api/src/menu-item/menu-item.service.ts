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

  /**
   * Create a menu item
   * @param {CreateMenuItemDto[]} createMenuItemDto The menu item data to be created
   * @returns {Promise<MenuItemResponseDto>} The menu item data after created
   * @throws {Error} if product or menu is not found
   */
  async bulkCreate(
    createMenuItemDto: CreateMenuItemDto[],
  ): Promise<MenuItemResponseDto[]> {
    const context = `${MenuItemService.name}.${this.bulkCreate.name}`;
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
    this.logger.log(
      `Menu items created: ${menuItems.map((m) => m.id)}`,
      context,
    );

    return this.mapper.mapArray(menuItems, MenuItem, MenuItemResponseDto);
  }

  /**
   * Create a menu item
   * @param {CreateMenuItemDto} createMenuItemDto The menu item data to be created
   * @returns {Promise<MenuItemResponseDto>} The menu item data after created
   * @throws {Error} if product or menu is not found
   */
  async create(
    createMenuItemDto: CreateMenuItemDto,
  ): Promise<MenuItemResponseDto> {
    const context = `${MenuItemService.name}.${this.create.name}`;
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
    this.logger.log(`Menu item created: ${createdMenuItem.id}`, context);

    return this.mapper.map(createdMenuItem, MenuItem, MenuItemResponseDto);
  }

  /**
   * Retrieve all menu items
   * @returns {Promise<MenuItemResponseDto[]>} The menu items data
   */
  async findAll(): Promise<MenuItemResponseDto[]> {
    const menuItems = await this.menuItemRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['product'],
    });
    return this.mapper.mapArray(menuItems, MenuItem, MenuItemResponseDto);
  }

  /**
   * Retrieve specific menu item
   * @param {string} slug
   * @returns {Promise<MenuItemResponseDto>} The menu item data
   */
  async findOne(slug: string): Promise<MenuItemResponseDto> {
    const menuItem = await this.menuItemRepository.findOne({
      where: { slug },
    });
    if (!menuItem) throw new Error('Menu item not found');
    return this.mapper.map(menuItem, MenuItem, MenuItemResponseDto);
  }

  update(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    return `This action updates a #${id} menuItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} menuItem`;
  }
}
