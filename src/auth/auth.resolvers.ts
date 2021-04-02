import { Inject } from '@nestjs/common';
import { Args, Context, GraphQLExecutionContext, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { query } from 'express';
import { User } from 'src/users/user.entity';
import { User as UserModel } from 'src/users/user.model';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';

@Resolver()
export class AuthResolvers {

  constructor(private authService: AuthService,
    @Inject('AUTH_SERVICE') private client: ClientProxy,

    ) {}

  // rabbitMQ test
  @Query(returns => String)
  log() {
    this.client.emit('log', 'data log')
  }

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