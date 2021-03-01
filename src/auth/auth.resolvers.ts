import { Args, Context, GraphQLExecutionContext, Mutation, Resolver } from '@nestjs/graphql';
import { Auth } from './auth.entity';
import { AuthService } from './auth.service';
import { AuthPayload } from './dto/auth.input';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';

@Resolver()
export class AuthResolvers {

  constructor(private authService: AuthService) {}

  @Mutation(returns => Auth)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
    @Context() ctx: GraphQLExecutionContext
  ): Promise<AuthPayload> {
    return this.authService.register({ registerInput, ctx });
  }

  @Mutation(returns => Auth)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() ctx: GraphQLExecutionContext
  ): Promise<AuthPayload> {
    return this.authService.login({ loginInput, ctx });
  }
}