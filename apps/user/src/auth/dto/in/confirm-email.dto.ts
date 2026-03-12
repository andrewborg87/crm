import { IsString, IsNotEmpty } from 'class-validator';

export class ConfirmEmailDto {
  /** The email confirmation token */
  @IsString()
  @IsNotEmpty()
  token: string;
}
