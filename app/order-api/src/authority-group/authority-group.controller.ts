import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthorityGroupService } from './authority-group.service';
import {
  CreateAuthorityGroupDto,
  UpdateAuthorityGroupDto,
} from './authority-group.dto';

@Controller('authority-group')
export class AuthorityGroupController {
  constructor(private readonly authorityGroupService: AuthorityGroupService) {}

  @Post()
  create(@Body() createAuthorityGroupDto: CreateAuthorityGroupDto) {
    return this.authorityGroupService.create(createAuthorityGroupDto);
  }

  @Get()
  findAll() {
    return this.authorityGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorityGroupService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAuthorityGroupDto: UpdateAuthorityGroupDto,
  ) {
    return this.authorityGroupService.update(+id, updateAuthorityGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorityGroupService.remove(+id);
  }
}
