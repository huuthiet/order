import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  ParseArrayPipe,
} from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CreateMenuItemDto,
  MenuItemResponseDto,
  UpdateMenuItemDto,
} from './menu-item.dto';
import { ApiResponseWithType } from 'src/app/app.decorator';
import { AppResponseDto } from 'src/app/app.dto';

@Controller('menu-item')
@ApiTags('Menu Item')
@ApiBearerAuth()
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create menu item' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiResponseWithType({
    type: MenuItemResponseDto,
    description: 'Menu item created successfully',
  })
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createMenuItemDto: CreateMenuItemDto,
  ) {
    const result = await this.menuItemService.create(createMenuItemDto);
    return {
      message: 'Menu item created successfully',
      statusCode: HttpStatus.CREATED,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<MenuItemResponseDto>;
  }

  @Post('/bulk')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create multiple menu items' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiResponseWithType({
    type: MenuItemResponseDto,
    isArray: true,
    description: 'Menu items created successfully',
  })
  async bulkCreate(
    @Body(new ParseArrayPipe({ items: CreateMenuItemDto }))
    createMenuItemDto: CreateMenuItemDto[],
  ) {
    const result = await this.menuItemService.bulkCreate(createMenuItemDto);
    return {
      message: 'Menu items created successfully',
      statusCode: HttpStatus.CREATED,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<MenuItemResponseDto[]>;
  }

  @Get()
  findAll() {
    return this.menuItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuItemService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menuItemService.update(+id, updateMenuItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuItemService.remove(+id);
  }
}
