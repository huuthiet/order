import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import { BaseResponseDto } from 'src/app/base.dto';
import { INVALID_USERID } from 'src/auth/auth.validation';
import { BranchResponseDto } from 'src/branch/branch.dto';

export class CurrentUserDto {
  @IsNotEmpty({ message: INVALID_USERID })
  userId: string;

  @IsOptional()
  scope?: string;
}

export class ResetPasswordRequestDto {
  @AutoMap()
  @ApiProperty()
  readonly user: string;
}

export class UserResponseDto extends BaseResponseDto {
  @ApiProperty()
  @AutoMap()
  readonly phonenumber: string;

  @ApiProperty()
  @AutoMap()
  readonly firstName: string;

  @ApiProperty()
  @AutoMap()
  readonly lastName: string;

  @AutoMap()
  @ApiProperty()
  readonly dob: string;

  @AutoMap()
  @ApiProperty()
  readonly email: string;

  @AutoMap()
  @ApiProperty()
  readonly address: string;

  @AutoMap(() => BranchResponseDto)
  @ApiProperty()
  readonly branch: BranchResponseDto;
}

export class GetAllUserQueryRequestDto {
  @AutoMap()
  @ApiProperty({
    description: 'The slug of branch',
    example: '',
    required: false,
  })
  @IsOptional()
  branch?: string;

  @AutoMap()
  @ApiProperty({
    example: 1,
    description: 'Page number',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @AutoMap()
  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  size: number = 10;
}
