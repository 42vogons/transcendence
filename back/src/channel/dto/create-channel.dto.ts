import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateChannelDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsNumber()
  member_id?: number;
}
