import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Tracking } from "src/tracking/tracking.entity";
import { Repository } from "typeorm";

@Injectable()
export class RobotConnectorService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}
}