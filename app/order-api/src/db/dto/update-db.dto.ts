import { PartialType } from '@nestjs/swagger';
import { CreateDbDto } from './create-db.dto';

export class UpdateDbDto extends PartialType(CreateDbDto) {}
