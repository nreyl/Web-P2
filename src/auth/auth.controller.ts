import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Public, TokenService } from '@nestjs/authentication';
import { UsersService } from '../users/users.service.js';
import { LoginDto, RefreshDto, RegisterDto } from './dto/auth.dto.js';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly users: UsersService,
    private readonly tokens: TokenService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.users.register(dto);
    return { message: 'Usuario registrado con éxito', userId: user.id };
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.users.verifyCredentials(dto.email, dto.password);
    return this.tokens.issue(user.id, { method: 'password' });
  }

  @HttpCode(200)
  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.tokens.refresh(dto.refreshToken);
  }

  @HttpCode(204)
  @Post('logout')
  async logout(@Body() dto: RefreshDto) {
    await this.tokens.revoke(dto.refreshToken);
  }
}
