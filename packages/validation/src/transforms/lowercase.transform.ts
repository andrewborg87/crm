import { isString } from 'class-validator';
import { TransformFnParams } from 'class-transformer/types/interfaces';

/**
 *
 * @param params The transform params, including the value to be transformed
 * @returns
 */
export const toLowerCase = (params: TransformFnParams) => {
  if (params.value && isString(params.value)) {
    params.value = params.value.toLowerCase();
  }

  return params.value;
};
