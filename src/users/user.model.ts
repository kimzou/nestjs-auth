import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
@Schema()
export class User {
  // @Prop({ type: MongooseSchema.Types.ObjectId })
  // _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  // * removed because firebase don't provide access to the password
  // @Prop({ required: true })
  // password: string;

  @Prop({ required: true })
  firebaseUid: string;

  @Prop({
    required: true,
    default: 'STUDENT',
    enum: ['STUDENT', 'TEACHER', 'ADMIN']
  })
  role: string
}

export const UserSchema = SchemaFactory.createForClass(User);
