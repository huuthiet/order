import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as _ from 'lodash';
import { getDayIndex } from 'src/helper';
import { Branch } from 'src/branch/branch.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as moment from 'moment';

@Injectable()
export class MenuScheduler {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async generateMenu() {
    const context = `${MenuScheduler.name}.${this.generateMenu.name}`;
    const today = new Date(moment().format('YYYY-MM-DD'));
    const dayIndex = getDayIndex(today);
    this.logger.log(`Generating menu for today = ${today}`, context);

    const branches = await this.branchRepository.find();
    this.logger.log(`Branch count = ${branches.length}`, context);

    const templateMenus = await this.getTemplateMenus(branches, dayIndex);
    this.logger.log(`Template menu count = ${templateMenus.length}`, context);

    const newMenus = templateMenus.map((menu) => {
      const newMenu = _.cloneDeep(menu);
      Object.assign(newMenu, {
        date: today,
        isTemplate: false,
        id: undefined,
        branch: menu.branch,
        menuItems: menu.menuItems.map((item) => {
          const newItem = _.cloneDeep(item);
          newItem.id = undefined;
          newItem.currentStock = newItem.defaultStock;
          newItem.product = newItem.product;
          return newItem;
        }),
      });
      return newMenu;
    });

    this.menuRepository.manager.transaction(async (manager) => {
      await manager.save(newMenus);
      this.logger.log(
        `Menu generated ${newMenus.map((item) => `${item.slug}, `)}`,
        context,
      );
    });
  }

  /**
   * Get template menus for the day
   * @param {Branch[]} branches
   * @param {number} dayIndex
   * @returns {Promise<Menu[]>} Template menus for the day
   */
  async getTemplateMenus(
    branches: Branch[],
    dayIndex: number,
  ): Promise<Menu[]> {
    const templateMenus = await Promise.all(
      branches
        .map(async (branch) => {
          const menu = await this.menuRepository.findOne({
            where: { branch: { id: branch.id }, dayIndex, isTemplate: true },
            relations: ['menuItems.product', 'branch'],
          });
          return menu;
        })
        .filter(async (menu) => !!(await menu)),
    );
    return templateMenus;
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async updateDayIndex() {
    const context = `${MenuScheduler.name}.${this.updateDayIndex.name}`;
    this.logger.log(`Updating day index for menus without day index`, context);

    const menusWithoutDayIndex = await this.menuRepository
      .createQueryBuilder('menu')
      .where('menu.dayIndex IS NULL')
      .getMany();
    this.logger.log(
      `Menu without day index count = ${menusWithoutDayIndex.length}`,
      context,
    );

    const updatedMenus = menusWithoutDayIndex.map((item) => {
      const dayIndex = getDayIndex(item.date);
      item.dayIndex = dayIndex;
      return item;
    });

    this.menuRepository.manager.transaction(async (manager) => {
      await manager.save(updatedMenus);
      this.logger.log(`Day index updated`, context);
    });
  }
}
