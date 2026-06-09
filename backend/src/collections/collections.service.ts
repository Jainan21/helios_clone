import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';

const mediaOrder = {
  orderBy: {
    sortOrder: 'asc' as const,
  },
};

const collectionInclude = {
  medias: mediaOrder,
  jewelry: {
    include: {
      medias: mediaOrder,
    },
    orderBy: {
      createdAt: 'desc' as const,
    },
  },
};

@Injectable()
export class CollectionsService {
  constructor(private prisma: PrismaService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async create(dto: CreateCollectionDto) {
    await this.validateExistingJewelry(dto.jewelryIds ?? []);
    await this.validateNewJewelrySlugs(dto.newJewelry ?? []);

    return this.prisma.collection.create({
      data: {
        name: dto.name,
        description: dto.description,
        medias: dto.medias
          ? {
              create: dto.medias.map((media) => ({
                url: media.url,
                type: media.type,
                isThumbnail: media.isThumbnail ?? false,
                sortOrder: media.sortOrder ?? 0,
              })),
            }
          : undefined,
        jewelry: {
          connect: (dto.jewelryIds ?? []).map((id) => ({ id })),
          create: (dto.newJewelry ?? []).map((item) => ({
            name: item.name,
            price: item.price,
            description: item.description,
            material: item.material,
            stone: item.stone,
            status: item.status,
            type: item.type,
            slug: item.slug,
            medias: item.medias
              ? {
                  create: item.medias.map((media) => ({
                    url: media.url,
                    type: media.type,
                    isThumbnail: media.isThumbnail ?? false,
                    sortOrder: media.sortOrder ?? 0,
                  })),
                }
              : undefined,
          })),
        },
      },
      include: collectionInclude,
    });
  }

  async uploadMedia(file: any) {
    if (!file || !file.buffer) {
      throw new BadRequestException('File is required for upload');
    }

    return new Promise<{ url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'helios/collections', resource_type: 'image' },
        (error, result) => {
          if (error) {
            reject(new BadRequestException(error.message));
            return;
          }

          if (!result?.secure_url) {
            reject(new BadRequestException('Cloudinary upload failed'));
            return;
          }

          resolve({ url: result.secure_url });
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async findAll(params: { page: number; limit: number }) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.collection.findMany({
        include: {
          medias: mediaOrder,
          _count: {
            select: {
              jewelry: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.collection.count(),
    ]);

    return {
      data: items,
      pagination: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: number) {
    return this.prisma.collection.findUniqueOrThrow({
      where: {
        id,
      },
      include: collectionInclude,
    });
  }

  private async validateExistingJewelry(jewelryIds: number[]) {
    if (jewelryIds.length === 0) {
      return;
    }

    const items = await this.prisma.jewelry.findMany({
      where: {
        id: {
          in: jewelryIds,
        },
      },
      select: {
        id: true,
        collectionId: true,
      },
    });

    if (items.length !== jewelryIds.length) {
      throw new BadRequestException('Some selected jewelry items do not exist');
    }

    const assignedItem = items.find((item) => item.collectionId !== null);
    if (assignedItem) {
      throw new BadRequestException('Selected jewelry must not already belong to a collection');
    }
  }

  private async validateNewJewelrySlugs(newJewelry: CreateCollectionDto['newJewelry']) {
    if (!newJewelry || newJewelry.length === 0) {
      return;
    }

    const slugs = newJewelry.map((item) => item.slug);
    const duplicateInPayload = slugs.find((slug, index) => slugs.indexOf(slug) !== index);
    if (duplicateInPayload) {
      throw new BadRequestException('New jewelry slugs must be unique');
    }

    const existed = await this.prisma.jewelry.findFirst({
      where: {
        slug: {
          in: slugs,
        },
      },
    });

    if (existed) {
      throw new BadRequestException('New jewelry slug already exists');
    }
  }
}
