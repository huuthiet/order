import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  RunWorkFlowRequestDto,
  WorkFlowExecutionResponseDto,
  WorkFlowResponseDto,
  QRLocationResponseDto,
  CreateQRLocationRequestDto,
  UpdateQRLocationRequestDto,
  GetWorkFlowExecutionResponseDto,
  CreateWorkflowRequestDto
} from "./robot-connector.dto";
import { catchError, firstValueFrom, retry } from "rxjs";
import { AxiosError } from "axios";
import { CreateTableRequestDto, TableResponseDto } from "src/table/table.dto";
import { CreateSizeRequestDto } from "src/size/size.dto";

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

  /* WORK FLOWS */
  async createWorkFlow(
    requestData: CreateWorkflowRequestDto
  ): Promise<WorkFlowResponseDto> {
    const requestUrl = `${this.robotApiUrl}/workflows`;
    const { data } = await firstValueFrom(
      this.httpService
        .post<WorkFlowResponseDto>(requestUrl, requestData, {})
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              `Create WorkFlow from ROBOT API failed: ${error.message}`,
            );
            throw error;
          }),
        ),
    );
    return data;
  }

  async getAllWorkFlows(): Promise<WorkFlowResponseDto[]> {
    const requestUrl = `${this.robotApiUrl}/workflows`;
    const { data } = await firstValueFrom(
      this.httpService.get<WorkFlowResponseDto[]>(requestUrl).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(
            `Get all WorkFlows from ROBOT API failed: ${error.message}`,
          );
          throw error;
        }),
      ),
    );
    return data;
  }

  async runWorkFlow(
    workFlowId: string,
    requestData: RunWorkFlowRequestDto,
  ): Promise<WorkFlowExecutionResponseDto> {
    const context = `${RobotConnectorClient.name}.${this.runWorkFlow.name}`;
    const requestUrl = `${this.robotApiUrl}/workflows/${workFlowId}/run`;
    const { data } = await firstValueFrom(
      this.httpService
      .post<WorkFlowExecutionResponseDto>(requestUrl, requestData)
      .pipe(
        catchError((error: AxiosError) => {
          this.logger.error(
            `Run workflow from ROBOT API ${workFlowId} failed: ${error.message}`, 
            context
          );
          throw new BadRequestException(`Run workflow failed`);
        }),
      )
    );
    return data;
  }

  /* WORKFLOW EXECUTIONS */
  async retrieveWorkFlowExecution(
    workFlowInstanceId: string
  ): Promise<GetWorkFlowExecutionResponseDto> {
    console.log({workFlowInstanceId})
    const requestUrl = `${this.robotApiUrl}/workflow-executions/${workFlowInstanceId}`;
    const { data } = await firstValueFrom(
      this.httpService
      .get<GetWorkFlowExecutionResponseDto>(requestUrl)
      .pipe(
        catchError((error: AxiosError) => {
          this.logger.error(
            `Get WorkFlow Execution from ROBOT API failed: ${error.message}`,
          );
          throw error;
        }),
      ),
    );
    return data;
  }

  async retrieveAllWorkFlowExecutions(): Promise<GetWorkFlowExecutionResponseDto[]> {
    const requestUrl = `${this.robotApiUrl}/workflow-executions`;
    const { data } = await firstValueFrom(
      this.httpService
      .get<GetWorkFlowExecutionResponseDto[]>(requestUrl)
      .pipe(
        catchError((error: AxiosError) => {
          this.logger.error(
            `Get all WorkFlow Executions from ROBOT API failed: ${error.message}`,
          );
          throw error;
        }),
      ),
    );
    return data;
  }

  /** QR LOCATIONS */
  async retrieveAllQRLocations(): Promise<QRLocationResponseDto[]> {
    const context = `${RobotConnectorClient.name}.${this.retrieveAllQRLocations.name}`;
    const requestUrl = `${this.robotApiUrl}/qr-locations`;
    console.log({ requestUrl });
    const { data } = await firstValueFrom(
      this.httpService.get<QRLocationResponseDto[]>(requestUrl).pipe(
        retry(3),
        catchError((error: AxiosError) => {
          this.logger.error(
            `Get all QR locations from ROBOT API failed: ${error.message}`,
            context,
          );
          throw new BadRequestException(error.message);
        }),
      ),
    );
    return data;
  }

  async createQRLocation(
    requestData: CreateQRLocationRequestDto,
  ): Promise<QRLocationResponseDto> {
    const requestUrl = `${this.robotApiUrl}/qr-locations`;
    const { data } = await firstValueFrom(
      this.httpService
        .post<QRLocationResponseDto>(requestUrl, requestData)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              `Create QR location from ROBOT API failed: ${error.message}`,
            );
            throw error;
          }),
        ),
    );
    return data;
  }

  async getQRLocationById(id: string): Promise<QRLocationResponseDto> {
    const requestUrl = `${this.robotApiUrl}/qr-locations/${id}`;
    const { data } = await firstValueFrom(
      this.httpService.get<QRLocationResponseDto>(requestUrl).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(
            `Get QR location by ID from ROBOT API failed: ${error.message}`,
          );
          throw error;
        }),
      ),
    );
    return data;
  }

  async updateQRLocation(
    id: string,
    requestData: UpdateQRLocationRequestDto,
  ): Promise<QRLocationResponseDto> {
    const requestUrl = `${this.robotApiUrl}/qr-locations/${id}`;
    const { data } = await firstValueFrom(
      this.httpService.put<QRLocationResponseDto>(requestUrl, requestData).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(
            `Update QR location by ID from ROBOT API failed: ${error.message}`,
          );
          throw error;
        }),
      ),
    );
    return data;
  }

  async deleteQRLocation(id: string): Promise<number> {
    const requestUrl = `${this.robotApiUrl}/qr-locations/${id}`;
    const response = await firstValueFrom(
      this.httpService.delete<number>(requestUrl).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(
            `Delete QR location by ID from ROBOT API failed: ${error.message}`,
          );
          throw error;
        }),
      ),
    );
    return response.status;
  }
}
