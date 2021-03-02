import { Args, Context, GraphQLExecutionContext, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/user.entity';
import { User as UserModel } from 'src/users/user.model';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';

@Resolver()
export class AuthResolvers {

  constructor(private authService: AuthService) {}

  @Mutation(returns => User)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
    @Context() ctx: GraphQLExecutionContext
  ): Promise<UserModel> {
    return this.authService.register({ registerInput, ctx });
  }

  @Mutation(returns => User)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() ctx: GraphQLExecutionContext
  ): Promise<UserModel> {
    return this.authService.login({ loginInput, ctx });
  }
}