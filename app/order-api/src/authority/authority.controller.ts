import { Controller } from '@nestjs/common';
import { AuthorityService } from './authority.service';

@Controller('authority')
export class AuthorityController {
  constructor(private readonly authorityService: AuthorityService) {}
}
