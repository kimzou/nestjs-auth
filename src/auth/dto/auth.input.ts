import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class AuthPayload {
  @Field(type => ID)
  idToken: string;
}