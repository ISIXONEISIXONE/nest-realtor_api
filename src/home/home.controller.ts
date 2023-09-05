import { Controller, Get, Post, Delete, Put, Query } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeResponseDto } from './dtos/home.dtos';
import { PropertyType } from '@prisma/client';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  async getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    //Forming a price object if min or max price exists
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;

    //Forming filters object based on passed query parameters and price obj
    const filters = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };

    //Passing filters into getHomes
    return this.homeService.getHomes(filters);
  }

  @Get(':id')
  getHomeById() {
    return {};
  }

  @Post()
  createHome() {
    return {};
  }

  @Put()
  updateHome() {
    return {};
  }

  @Delete()
  deleteHome() {
    return;
  }
}
