import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { Repository } from 'typeorm';
import { CreateMenuDto, MenuResponseDto, UpdateMenuDto } from './menu.dto';
import { Branch } from 'src/branch/branch.entity';
import { MenuValidation } from './menu.validation';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { MenuException } from './menu.exception';

@Injectable()
export class MenuService {
  private readonly logger = new Logger(MenuService.name);
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  /**
   *
   * @param {string} slug
   * @returns {Promise<MenuResponseDto>} New menu created successfully
   * @throws {MenuException} Menu not found
   */
  async restoreMenu(slug: string): Promise<MenuResponseDto> {
    const menu = await this.menuRepository.findOne({
      where: { slug },
      withDeleted: true,
    });
    if (!menu) throw new MenuException(MenuValidation.MENU_NOT_FOUND);

    const restored = await this.menuRepository.recover(menu);
    return this.mapper.map(restored, Menu, MenuResponseDto);
  }

  /**
   *
   * @param {string} slug
   * @returns {Promise<MenuResponseDto>} New menu created successfully
   * @throws {MenuException} Menu not found
   */
  async getMenu(slug: string): Promise<MenuResponseDto> {
    const menu = await this.menuRepository.findOne({ where: { slug } });
    if (!menu) throw new MenuException(MenuValidation.MENU_NOT_FOUND);
    return this.mapper.map(menu, Menu, MenuResponseDto);
  }

  /**
   * @param {string} slug
   * @returns {Promise<boolean>} Menu soft deleted successfully if return true
   * @throws {MenuException} Menu not found
   */
  async deleteMenu(slug: string): Promise<number> {
    const menu = await this.menuRepository.findOne({ where: { slug } });
    if (!menu) throw new MenuException(MenuValidation.MENU_NOT_FOUND);
    const deleted = await this.menuRepository.softDelete(menu.id);
    return deleted.affected;
  }

  /**
   * @param {string} slug
   * @param {UpdateMenuDto} requestData
   * @returns {Promise<MenuResponseDto>} Menu updated successfully
   * @throws {MenuException} Invalid branch slug
   */
  async updateMenu(
    slug: string,
    requestData: UpdateMenuDto,
  ): Promise<MenuResponseDto> {
    throw new Error('Method not implemented.');
  }

  /**
   *
   * @param {CreateMenuDto} requestData
   * @returns {Promise<MenuResponseDto>} New menu created successfully
   * @throws {MenuException} Invalid branch slug
   */
  async createMenu(requestData: CreateMenuDto): Promise<MenuResponseDto> {
    const branch = await this.branchRepository.findOne({
      where: { slug: requestData.branchSlug },
    });
    if (!branch) {
      this.logger.error(`Invalid branch slug: ${requestData.branchSlug}`);
      throw new MenuException(MenuValidation.INVALID_BRANCH_SLUG);
    }

    const menu = this.mapper.map(requestData, CreateMenuDto, Menu);
    Object.assign(menu, { branch });

    this.menuRepository.create(menu);
    const createdMenu = await this.menuRepository.save(menu);
    this.logger.log(`New menu created: ${createdMenu.slug}`);

    return this.mapper.map(createdMenu, Menu, MenuResponseDto);
  }

  /**
   *
   * @param {any} query
   * @returns {Promise<MenuResponseDto[]>} All menus retrieved successfully
   */
  async getAllMenus(query: any): Promise<MenuResponseDto[]> {
    const menus = await this.menuRepository.find();
    return this.mapper.mapArray(menus, Menu, MenuResponseDto);
  }
}
