import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('AUTH_SERVICE') private client: ClientProxy
  ) { }

  @Get()
  getHello(): string {
    this.client.emit('login', 'data login')
    return this.authService.getHello();
  }
}
