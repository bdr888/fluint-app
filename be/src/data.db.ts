import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuid_v4 } from 'uuid';

@Schema({
  collection: 'Data',
  autoCreate: true,
  timestamps: {
    createdAt: 'created',
  },
})
export class Data {
  @Prop({ type: String, default: uuid_v4 })
  _id?: string;

  @Prop({ type: String })
  data: string;
}

export const DataSchema = SchemaFactory.createForClass(Data);

export const DataCollection = {
  name: Data.name,
  schema: DataSchema,
};

export const DataConnection = MongooseModule.forFeature(
  [DataCollection],
  'local',
);
