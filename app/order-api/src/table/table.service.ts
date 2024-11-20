import { BadRequestException, Injectable } from '@nestjs/common';
import { 
  CreateTableRequestDto, 
  TableResponseDto, 
  UpdateTableRequestDto
} from './table.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Table } from './table.entity';
import { Repository } from 'typeorm';
import { Branch } from 'src/branch/branch.entity';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectMapper() private readonly mapper: Mapper,
  ){}

  /**
   * Create a new table
   * @param {CreateTableRequestDto} createTableDto The data to create a new table
   * @returns {Promise<TableResponseDto>} The created table
   * @throws {BadRequestException} If the table name already exists in this branch
   */
  async create(
    createTableDto: CreateTableRequestDto
  ): Promise<TableResponseDto> {
    const branch = await this.branchRepository.findOneBy({ slug: createTableDto.branch });
    if(!branch) throw new BadRequestException('Branch is not found');

    const tableData = this.mapper.map(createTableDto, CreateTableRequestDto, Table);
    const existedTable = await this.tableRepository.findOne({
      where: {
        branch: {
          slug: createTableDto.branch
        },
        name: tableData.name
      }
    });
    if(existedTable) throw new BadRequestException('Table name already exists');
    
    Object.assign(tableData, { branch });
    const table = await this.tableRepository.create(tableData);
    const createdTable = await this.tableRepository.save(table);
    const tableDto = this.mapper.map(createdTable, Table, TableResponseDto);
    return tableDto;
  }

  /**
   * Retrieve all tables by branch
   * @param {string} branch The slug of branch 
   * @returns {Promise<TableResponseDto[]>} The array of retrieved tables
   */
  async findAll(branch: string): Promise<TableResponseDto[]> {
    const branchData = await this.branchRepository.findOneBy({ slug: branch });
    if(!branchData) throw new BadRequestException('Branch is not found');

    const tables = await this.tableRepository.find({
      where: {
        branch: {
          slug: branch
        }
      }
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
    slug: string
  ): Promise<TableResponseDto> {
    const table = await this.tableRepository.findOneBy({ slug });
    if(!table) throw new BadRequestException('Table is not found');

    const currentStatus = table.isEmpty;
    Object.assign(table, { isEmpty: !currentStatus });
    const updatedTable = await this.tableRepository.save(table);
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
    updateTableDto: UpdateTableRequestDto
  ): Promise<TableResponseDto> {
    const table = await this.tableRepository.findOne({
      where: {
        slug
      },
      relations: ['branch']
    });
    if(!table) throw new BadRequestException('Table is not found');

    const tableData = this.mapper.map(updateTableDto, UpdateTableRequestDto, Table);
    const isExist = await this.isExistUpdatedName(
      tableData.name,
      table.name,
      table.branch.id
    );
    if(isExist) throw new BadRequestException('The updated name already exists in this branch');

    Object.assign(table, tableData);
    const updatedTable = await this.tableRepository.save(table);
    const tableDto = this.mapper.map(updatedTable, Table, TableResponseDto);
    return tableDto;
  }

  /**
   * Check the updated does exists or not
   * @param {string} updatedName The name to update for table
   * @param {string} currentName The current name of table 
   * @param branchId The branch id of table 
   * @returns {Promise<Boolean>} The result of checking is true or false
   */
  async isExistUpdatedName(
    updatedName: string,
    currentName: string,
    branchId: string
  ): Promise<Boolean> {
    if(updatedName === currentName) return false; 
      
    const tableExist = await this.tableRepository.findOne({
      where: {
        name: updatedName,
        branch: {
          id: branchId
        }
      }
    });
    if(tableExist) return true;

    return false;
  }

  /**
   * Delete table by slug
   * @param {string} slug The slug of table
   * @returns {Promise<number>} The number of deleted records
   */
  async remove(slug: string): Promise<number> {
    const table = await this.tableRepository.findOneBy({ slug });
    if(!table) throw new BadRequestException('Table is not found');
    const deleted = await this.tableRepository.softDelete({ slug });
    return deleted.affected || 0;
  }
}
