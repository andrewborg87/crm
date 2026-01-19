import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common/interfaces/features/pipe-transform.interface';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'booleanValidator' })
export class BooleanValidator implements ValidatorConstraintInterface, PipeTransform {
  /**
   * Validates the value making sure it is a boolean
   * @param value The value to validate
   */
  validate(value: unknown): boolean {
    if (value === undefined || value === null) {
      return false;
    }

    return 'boolean' === typeof value || ['true', 'false', '1', '0'].includes(value.toString().toLowerCase());
  }

  /**
   * Transforms the value to a boolean
   * @param value The value to transform
   * @param metadata The metadata about the value
   */
  transform(value: any, metadata: ArgumentMetadata): boolean {
    if (!this.validate(value)) {
      throw new BadRequestException(
        this.defaultMessage({
          property: metadata.data ?? 'Field',
          value: value,
          constraints: [],
          object: {},
          targetName: '',
        }),
      );
    }

    return ['true', '1'].includes(value.toString().toLowerCase());
  }

  /**
   * Returns the default error message
   * @param validationArguments The validation arguments
   */
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.property ?? 'Field'} must be boolean`;
  }
}
