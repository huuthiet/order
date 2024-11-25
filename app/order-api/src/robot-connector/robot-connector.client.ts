import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { InitiateWorkFlowInstanceRequestDto, InitiateWorkFlowInstanceResponseDto, RetrieveWorkFlowResponseDto } from "./robot-connector.dto";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";

@Injectable()
export class RobotConnectorClient {
  private readonly robotApiUrl: string =
    this.configService.get<string>('ROBOT_API_URL');

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async initiateWorkFlowInstance(
    requestData: InitiateWorkFlowInstanceRequestDto
  ): Promise<InitiateWorkFlowInstanceResponseDto> {
    const requestUrl = `${this.robotApiUrl}`;
    const { data } = await firstValueFrom(
      this.httpService
      .post<InitiateWorkFlowInstanceResponseDto>(requestUrl, requestData, {

      })
      .pipe(
        catchError((error: AxiosError) => {
          this.logger.error(
            `Init WorkFlow from ROBOT API failed: ${error.message}`,
          );
          throw error;
        }),
      )
    );
    return data;
  }

  async retrieveWorkFlow(
    workFlowId: string
  ): Promise<RetrieveWorkFlowResponseDto> {
    const requestUrl = `${this.robotApiUrl}/${workFlowId}`;
    const { data } = await firstValueFrom(
      this.httpService
      .get<RetrieveWorkFlowResponseDto>(requestUrl)
      .pipe(
        catchError((error: AxiosError) => {
          this.logger.error(
            `Get WorkFlow data from ROBOT API failed: ${error.message}`,
          );
          throw error;
        }),
      )
    );
    return data;
  }
}