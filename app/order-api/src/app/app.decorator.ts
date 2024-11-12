import { applyDecorators, HttpCode, HttpStatus, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AppPaginatedResponseDto, AppResponseDto } from './app.dto';

export interface IApiResponseOptions<TModel> {
  type: TModel;
  description: string;
  status?: HttpStatus;
}

/**
 * Custom decorator that allows you to dynamically specify the type, status and description for a response
 * @param options: IApiResponseOptions<TModel>
 * @returns The decorator
 */
export function ApiResponseWithType<TModel extends Type<any>>({
  type,
  description,
  status = HttpStatus.OK,
  isArray = false,
}: IApiResponseOptions<TModel> & { isArray?: boolean }) {
  return applyDecorators(
    ApiExtraModels(AppResponseDto, type),
    ApiResponse({
      status: status,
      description: description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(AppResponseDto) },
          {
            properties: {
              result: isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(type) }, // Each item in the array will follow the model type
                  }
                : { $ref: getSchemaPath(type) },
            },
          },
        ],
      },
    }),
  );
}

/**
 * This decorator is used to define a paginated response, where the 'result' field contains an array of models and
 * pagination information is provided along with a custom description.
 *
 * @param options: IApiResponseOptions<TModel>
 * @returns The decorator
 */
export const ApiPaginatedResponse = <TModel extends Type<any>>({
  status = HttpStatus.OK,
  description,
  type,
}: IApiResponseOptions<TModel>) => {
  return applyDecorators(
    ApiExtraModels(AppPaginatedResponseDto, type),
    ApiResponse({
      status: status,
      description: description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(AppPaginatedResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(type) },
              },
            },
          },
        ],
      },
    }),
  );
};
