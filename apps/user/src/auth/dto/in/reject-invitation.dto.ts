import { IsString, IsNotEmpty } from 'class-validator';

export class RejectInvitationDto {
  /** The invitation token */
  @IsString()
  @IsNotEmpty()
  token: string;
}
