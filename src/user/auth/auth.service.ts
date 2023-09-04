import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
interface SignUpParams {
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface SignInParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signUp(
    { email, password, name, phone }: SignUpParams,
    userType: UserType,
  ) {
    const userExists = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException('User Exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        user_type: userType,
      },
    });

    return this.generatejwt(user.name, user.id);
  }

  async signIn({ email, password }: SignInParams) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException('Invslid credentials', 400);
    }

    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) {
      throw new HttpException('Invslid credentials', 400);
    }

    const token = this.generatejwt(user.name, user.id);
    return token;
  }

  private generatejwt(name: string, id: number) {
    return jwt.sign(
      {
        name,
        id,
      },
      process.env.JSON__TOKEN__KEY,
      {
        expiresIn: 3600000,
      },
    );
  }

  generateProductKey(email: string, userType: UserType) {
    const string = `${email}-${userType}-${process.env.PRODUCT__KEY__SECRET}`;
    return bcrypt.hash(string, 10);
  }
}
