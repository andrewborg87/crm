export interface UserCreatedDto {
  /** The unique identifier of the user */
  id: string;
  /** The date the integration was created (UTC millisecond timestamp) */
  createdAt: number;
}
