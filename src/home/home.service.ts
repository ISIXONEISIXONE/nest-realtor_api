import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dtos/home.dtos';
import { PropertyType } from '@prisma/client';
import { NotFoundException } from '@nestjs/common/exceptions';

// Interface for filtering Homes database Array
interface GetHomesParam {
  city: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  propertyType?: PropertyType;
}

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(filter: GetHomesParam): Promise<HomeResponseDto[]> {
    // Providing search with passed filters object grom Home Controller
    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        adress: true,
        city: true,
        price: true,
        property_type: true,
        number_of_bathrooms: true,
        number_of_bedrooms: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      where: filter,
    });

    // If search with applied filters found nothing...
    if (!homes.length) throw new NotFoundException('No Homes like this');

    // Block for using onle one image from Images array
    return homes.map((home) => {
      const fetchedHome = {
        ...home,
        image: home.images[0].url,
      };

      // Deleting images array from mapped FetchedHome array
      // Creating new instanse of HomeResponse and passing fetchedHome there
      delete fetchedHome.images;
      return new HomeResponseDto(fetchedHome);
    });
  }
}
