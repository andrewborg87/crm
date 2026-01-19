import { TransformFnParams } from 'class-transformer/types/interfaces';

export const toArray = (transform?: (item: any) => unknown) => (params: TransformFnParams) => {
  if (params?.value === undefined) {
    return params.value;
  }

  // Assign a default transform function if none is provided
  transform = transform || ((item) => item);

  return Array.isArray(params?.value) ? params?.value.map(transform) : [transform(params?.value)];
};
