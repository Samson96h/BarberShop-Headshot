import { IsMongoId } from 'class-validator';

export class IdDTO {
  @IsMongoId()
  id: string;
}
