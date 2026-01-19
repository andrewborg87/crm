import { Type } from 'class-transformer';

export class PaginatedResDto<T> {
  /** The current page being returned */
  page: number;
  /** Number of records per page */
  limit: number;
  /** Total number of records available */
  total?: number;

  /** The records being returned */
  @Type(() => Array)
  data: T[];

  constructor(dto: PaginatedResDto<T>) {
    this.page = dto.page ?? 1;
    this.limit = dto.limit ?? 10;
    this.data = dto.data;
    this.total = dto.total;
  }
}
