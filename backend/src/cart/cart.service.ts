import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

const cartInclude = {
  jewelry: {
    include: {
      medias: {
        orderBy: {
          sortOrder: 'asc' as const,
        },
      },
    },
  },
};

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: number) {
    await this.ensureUser(userId);

    return this.prisma.cartItem.findMany({
      where: {
        userId,
      },
      include: cartInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async addItem(userId: number, dto: AddCartItemDto) {
    await this.ensureUser(userId);
    await this.ensureJewelry(dto.jewelryId);

    await this.prisma.cartItem.upsert({
      where: {
        userId_jewelryId: {
          userId,
          jewelryId: dto.jewelryId,
        },
      },
      update: {
        quantity: {
          increment: dto.quantity,
        },
      },
      create: {
        userId,
        jewelryId: dto.jewelryId,
        quantity: dto.quantity,
      },
    });

    return this.findByUser(userId);
  }

  async updateItem(userId: number, jewelryId: number, dto: UpdateCartItemDto) {
    await this.ensureUser(userId);

    if (dto.quantity <= 0) {
      await this.prisma.cartItem.deleteMany({
        where: {
          userId,
          jewelryId,
        },
      });

      return this.findByUser(userId);
    }

    await this.prisma.cartItem.update({
      where: {
        userId_jewelryId: {
          userId,
          jewelryId,
        },
      },
      data: {
        quantity: dto.quantity,
      },
    });

    return this.findByUser(userId);
  }

  async removeItem(userId: number, jewelryId: number) {
    await this.ensureUser(userId);

    await this.prisma.cartItem.deleteMany({
      where: {
        userId,
        jewelryId,
      },
    });

    return this.findByUser(userId);
  }

  async clear(userId: number) {
    await this.ensureUser(userId);

    await this.prisma.cartItem.deleteMany({
      where: {
        userId,
      },
    });

    return [];
  }

  private async ensureUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }
  }

  private async ensureJewelry(jewelryId: number) {
    const jewelry = await this.prisma.jewelry.findUnique({
      where: {
        id: jewelryId,
      },
    });

    if (!jewelry) {
      throw new BadRequestException('Jewelry not found');
    }
  }
}
