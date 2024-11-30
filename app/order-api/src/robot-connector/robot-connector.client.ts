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
  RunWorkflowRequestDto,
  WorkflowExecutionResponseDto,
  WorkflowResponseDto,
  QRLocationResponseDto,
  CreateQRLocationRequestDto,
  UpdateQRLocationRequestDto,
  GetWorkflowExecutionResponseDto,
  CreateWorkflowRequestDto,
  RobotResponseDto
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

  /* RAYBOTS */
  async getRobotById(
    id: string
  ): Promise<RobotResponseDto> {
    const context = `${RobotConnectorClient.name}.${this.getRobotById.name}`;
    const requestUrl = `${this.robotApiUrl}/raybots/${id}`;
    const { data } = await firstValueFrom(
      this.httpService
        .get<RobotResponseDto>(requestUrl)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              `Get robot ${id} data from ROBOT API failed: ${error.message}`, 
              context
            );
            throw new BadRequestException(`Get robot data failed`);
          }),
        ),
    );
    return data;
  }

  /* WORK FLOWS */
  async createWorkflow(
    requestData: CreateWorkflowRequestDto
  ): Promise<WorkflowResponseDto> {
    const requestUrl = `${this.robotApiUrl}/workflows`;
    const { data } = await firstValueFrom(
      this.httpService
        .post<WorkflowResponseDto>(requestUrl, requestData, {})
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              `Create Workflow from ROBOT API failed: ${error.message}`,
            );
            throw error;
          }),
        ),
    );
    return data;
  }

  async getAllWorkflows(): Promise<WorkflowResponseDto[]> {
    const requestUrl = `${this.robotApiUrl}/workflows`;
    const { data } = await firstValueFrom(
      this.httpService.get<WorkflowResponseDto[]>(requestUrl).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(
            `Get all Workflows from ROBOT API failed: ${error.message}`,
          );
          throw error;
        }),
      ),
    );
    return data;
  }

  async runWorkflow(
    workflowId: string,
    requestData: RunWorkflowRequestDto,
  ): Promise<WorkflowExecutionResponseDto> {
    const context = `${RobotConnectorClient.name}.${this.runWorkflow.name}`;
    const requestUrl = `${this.robotApiUrl}/workflows/${workflowId}/run`;
    const { data } = await firstValueFrom(
      this.httpService
      .post<WorkflowExecutionResponseDto>(requestUrl, requestData)
      .pipe(
        catchError((error: AxiosError) => {
          this.logger.error(
            `Run workflow from ROBOT API ${workflowId} failed: ${error.message}`, 
            context
          );
          throw new BadRequestException(`Run workflow failed`);
        }),
      )
    );
    return data;
  }

  /* WORKFLOW EXECUTIONS */
  async retrieveWorkflowExecution(
    workflowExecutionId: string
  ): Promise<GetWorkflowExecutionResponseDto> {
    console.log({workflowExecutionId})
    const requestUrl = `${this.robotApiUrl}/workflow-executions/${workflowExecutionId}`;
    const { data } = await firstValueFrom(
      this.httpService
      .get<GetWorkflowExecutionResponseDto>(requestUrl)
      .pipe(
        catchError((error: AxiosError) => {
          this.logger.error(
            `Get Workflow Execution from ROBOT API failed: ${error.message}`,
          );
          throw error;
        }),
      ),
    );
    return data;
  }

  async retrieveAllWorkflowExecutions(): Promise<GetWorkflowExecutionResponseDto[]> {
    const requestUrl = `${this.robotApiUrl}/workflow-executions`;
    const { data } = await firstValueFrom(
      this.httpService
      .get<GetWorkflowExecutionResponseDto[]>(requestUrl)
      .pipe(
        catchError((error: AxiosError) => {
          this.logger.error(
            `Get all Workflow Executions from ROBOT API failed: ${error.message}`,
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
