import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @Field()
  idToken: string;
  uid: string;
  displayName?: string;
  email: string;
  emailVerified?: boolean;
}