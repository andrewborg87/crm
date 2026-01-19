import { TransformFnParams } from 'class-transformer/types/interfaces';

export const toBoolean = (params: TransformFnParams) => {
  if (params?.value === 'true' || Number(params?.value) === 1 || params?.value === true) {
    return true;
  }

  if (params?.value === 'false' || Number(params?.value) === 0 || params?.value === false) {
    return false;
  }

  return params?.value;
};
