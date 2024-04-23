import { Prop } from '@nestjs/mongoose';

export class CreateDataDto {
  @Prop({ type: String })
  data: string;
}

export class UpdateDataDto {
  @Prop({ type: String })
  data?: string;
}
