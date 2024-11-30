import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  CreateTableRequestDto,
  TableResponseDto,
  UpdateTableRequestDto,
  UpdateTableStatusRequestDto,
} from './table.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Table } from './table.entity';
import { Repository } from 'typeorm';
import { Branch } from 'src/branch/branch.entity';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RobotConnectorClient } from 'src/robot-connector/robot-connector.client';
import { BranchException } from 'src/branch/branch.exception';
import { BranchValidation } from 'src/branch/branch.validation';
import { TableException } from './table.exception';
import { TableValidation } from './table.validation';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectMapper() private readonly mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly robotConnectorClient: RobotConnectorClient,
  ) {}

  async getLocations() {
    return this.robotConnectorClient.retrieveAllQRLocations();
  }

  /**
   * Create a new table
   * @param {CreateTableRequestDto} createTableDto The data to create a new table
   * @returns {Promise<TableResponseDto>} The created table
   * @throws {BadRequestException} If the table name already exists in this branch
   */
  async create(
    createTableDto: CreateTableRequestDto,
  ): Promise<TableResponseDto> {
    const context = `${TableService.name}.${this.create.name}`;
    const branch = await this.branchRepository.findOneBy({
      slug: createTableDto.branch,
    });
    if (!branch) {
      this.logger.warn(`Branch ${createTableDto.branch} not found`, context);
      throw new BranchException(BranchValidation.BRANCH_NOT_FOUND);
    }

    const tableData = this.mapper.map(
      createTableDto,
      CreateTableRequestDto,
      Table,
    );
    const existedTable = await this.tableRepository.findOne({
      where: {
        branch: {
          slug: createTableDto.branch,
        },
        name: tableData.name,
      },
    });
    if (existedTable) {
      this.logger.warn(
        `Table name ${createTableDto.name} already exists`,
        context,
      );
      throw new TableException(TableValidation.TABLE_NAME_EXIST);
    }

    Object.assign(tableData, { branch });
    const table = this.tableRepository.create(tableData);
    const createdTable = await this.tableRepository.save(table);
    this.logger.log(
      `Table ${createTableDto.name} created successfully`,
      context,
    );
    const tableDto = this.mapper.map(createdTable, Table, TableResponseDto);
    return tableDto;
  }

  /**
   * Retrieve all tables by branch
   * @param {string} branch The slug of branch
   * @returns {Promise<TableResponseDto[]>} The array of retrieved tables
   */
  async findAll(branch: string): Promise<TableResponseDto[]> {
    const context = `${TableService.name}.${this.findAll.name}`;
    const branchData = await this.branchRepository.findOneBy({ slug: branch });
    if (!branchData) {
      this.logger.warn(`Branch ${branch} not found`, context);
      throw new BranchException(BranchValidation.BRANCH_NOT_FOUND);
    }

    const tables = await this.tableRepository.find({
      where: {
        branch: {
          slug: branch,
        },
      },
    });
    const tablesDto = this.mapper.mapArray(tables, Table, TableResponseDto);
    return tablesDto;
  }

  /**
   * Change status table by slug
   * @param {string} slug The slug of table needs changing status
   * @returns {Promise<TableResponseDto>} The table data after change status
   * @throws {BadRequestException} If table is not found
   */
  async changeStatus(
    slug: string,
    requestData: UpdateTableStatusRequestDto,
  ): Promise<TableResponseDto> {
    const context = `${TableService.name}.${this.changeStatus.name}`;
    const table = await this.tableRepository.findOneBy({ slug });
    if (!table) {
      this.logger.warn(`Table ${slug} not found`, context);
      throw new TableException(TableValidation.TABLE_NOT_FOUND);
    }

    Object.assign(table, { ...requestData });
    const updatedTable = await this.tableRepository.save(table);
    this.logger.log(`Table ${slug} changed status successfully`, context);
    const tableDto = this.mapper.map(updatedTable, Table, TableResponseDto);
    return tableDto;
  }

  /**
   * Update table data by slug
   * @param {string} slug The slug of table needs updating
   * @param {UpdateTableRequestDto} updateTableDto The data to update table
   * @returns {Promise<TableResponseDto>} The updated table
   * @throws {BadRequestException} If table is not found
   * @throws {BadRequestException} If the updated name of table that already exists at this branch
   */
  async update(
    slug: string,
    updateTableDto: UpdateTableRequestDto,
  ): Promise<TableResponseDto> {
    const context = `${TableService.name}.${this.update.name}`;
    const table = await this.tableRepository.findOne({
      where: {
        slug,
      },
      relations: ['branch'],
    });
    if (!table) {
      this.logger.warn(`Table ${slug} not found`, context);
      throw new TableException(TableValidation.TABLE_NOT_FOUND);
    }

    // const isExist = await this.tableRepository.findOne({
    //   where: {
    //     name: updateTableDto.name,
    //     location: updateTableDto.location,
    //     branch: {
    //       id: table.branch.id,
    //     },
    //   },
    // });

    // if (isExist) {
    //   this.logger.warn(
    //     `Table with ${updateTableDto.name} and ${updateTableDto.location} location already exist`,
    //     context,
    //   );
    //   throw new TableException(TableValidation.TABLE_NAME_EXIST);
    // }

    const tableData = this.mapper.map(
      updateTableDto,
      UpdateTableRequestDto,
      Table,
    );

    Object.assign(table, tableData);
    const updatedTable = await this.tableRepository.save(table);
    this.logger.log(`Table ${slug} updated successfully`, context);
    const tableDto = this.mapper.map(updatedTable, Table, TableResponseDto);
    return tableDto;
  }

  /**
   * Delete table by slug
   * @param {string} slug The slug of table
   * @returns {Promise<number>} The number of deleted records
   */
  async remove(slug: string): Promise<number> {
    const context = `${TableService.name}.${this.remove.name}`;
    const table = await this.tableRepository.findOneBy({ slug });
    if (!table) {
      this.logger.warn(`Table ${slug} not found`, context);
      throw new TableException(TableValidation.TABLE_NOT_FOUND);
    }
    const deleted = await this.tableRepository.softDelete({ slug });
    this.logger.log(`Table ${slug} deleted successfully`, context);
    return deleted.affected || 0;
  }
}
