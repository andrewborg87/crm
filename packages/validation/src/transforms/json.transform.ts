import { UnprocessableEntityException } from '@nestjs/common';
import { TransformFnParams } from 'class-transformer/types/interfaces';

export const toJson = (params: TransformFnParams) => {
  try {
    return params?.value && JSON.parse(params?.value);
  } catch {
    throw new UnprocessableEntityException(`${params.key} must be a valid JSON`);
  }
};
