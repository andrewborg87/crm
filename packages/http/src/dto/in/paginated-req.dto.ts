import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsEnum, IsOptional, IsPositive } from 'class-validator';

import { SortDir } from '@crm/types';

export class PaginatedReqDto {
  /** The current page being returned */
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page: number = 1;

  /** Number of records per page */
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  limit: number = 10;

  /** The sort direction of the records being returned */
  @ApiPropertyOptional({ enum: SortDir, enumName: 'SortDir' })
  @IsOptional()
  @IsEnum(SortDir)
  sortDir: SortDir = SortDir.DESC;

  constructor(dto: Partial<PaginatedReqDto> = {}) {
    this.page = dto.page ?? 1;
    this.limit = dto.limit ?? 10;
    this.sortDir = dto.sortDir ?? SortDir.DESC;
  }
}
