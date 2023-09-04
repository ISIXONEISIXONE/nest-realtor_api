import {
  Body,
  Controller,
  Post,
  Param,
  ParseEnumPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenProdKeyDto, SignInDto, SignUpDto } from './dtos/auth.dtos';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  async signUp(
    @Body() body: SignUpDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        throw new UnauthorizedException('Product key require');
      }

      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT__KEY__SECRET}`;
      const isValidKey = await bcrypt.compare(validProductKey, body.productKey);

      if (!isValidKey) {
        throw new UnauthorizedException('Invalid product key');
      }
    }
    return this.authService.signUp(body, userType);
  }

  @Post('/signin')
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @Post('/key')
  generateProductKey(@Body() { userType, email }: GenProdKeyDto) {
    return this.authService.generateProductKey(email, userType);
  }
}
