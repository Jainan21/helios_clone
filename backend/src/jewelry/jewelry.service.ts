import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJewelryDto } from './dto/create-jewelry.dto';
import { UpdateJewelryDto } from './dto/update-jewelry.dto';

import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service';

const mediaOrder = {
  orderBy: {
    sortOrder: 'asc' as const,
  },
};

@Injectable()
export class JewelryService {
  constructor(private prisma: PrismaService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async create(dto: CreateJewelryDto) {
    const existed = await this.prisma.jewelry.findUnique({
      where: {
        slug: dto.slug,
      },
    });

    if (existed) {
      throw new BadRequestException('Slug already exists');
    }

    return this.prisma.jewelry.create({
      data: {
        name: dto.name,
        price: dto.price,
        description: dto.description,
        material: dto.material,
        stone: dto.stone,
        status: dto.status,
        type: dto.type,
        slug: dto.slug,
        collectionId: dto.collectionId,
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
      },
      include: {
        medias: mediaOrder,
      },
    });
  }

  async uploadMedia(file: any) {
    if (!file || !file.buffer) {
      throw new BadRequestException('File is required for upload');
    }

    return new Promise<{ url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'helios', resource_type: 'image' },
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

  async findAll(params: {
    status?: string;
    type?: string;
    search?: string;
    collection?: string;
    page: number;
    limit: number;
  }) {
    const { status, type, search, collection, page, limit } = params;
    const skip = (page - 1) * limit;
    const where: any = {
      status: {
        not: 'HIDDEN',
      },
    };

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (collection === 'unassigned') {
      where.collectionId = null;
    }

    const [items, total] = await Promise.all([
      this.prisma.jewelry.findMany({
        where,
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          material: true,
          stone: true,
          status: true,
          type: true,
          slug: true,
          collectionId: true,
          medias: {
            select: {
              id: true,
              url: true,
              type: true,
              isThumbnail: true,
              sortOrder: true,
            },
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.jewelry.count({
        where,
      }),
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
    return this.prisma.jewelry.findUniqueOrThrow({
      where: {
        id,
      },
      
      include: {
        medias: mediaOrder,
      },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.jewelry.findUniqueOrThrow({
      where: {
        slug,
      },
      include: {
        medias: mediaOrder,
        collection: true,
      },
    });
  }

  update(id: number, updateJewelryDto: UpdateJewelryDto) {
    return this.prisma.jewelry.update({
      where: {
        id,
      },
      
      data: {
        name: updateJewelryDto.name,
        price: updateJewelryDto.price,
        description: updateJewelryDto.description,
        material: updateJewelryDto.material,
        stone: updateJewelryDto.stone,
        status: updateJewelryDto.status,
        type: updateJewelryDto.type,
        slug: updateJewelryDto.slug,
        collectionId: updateJewelryDto.collectionId,
        medias: updateJewelryDto.medias
          ? {
              deleteMany: {},
              create: updateJewelryDto.medias.map((media) => ({
                url: media.url,
                type: media.type,
                isThumbnail: media.isThumbnail ?? false,
                sortOrder: media.sortOrder ?? 0,
              })),
            }
          : undefined,
      },
      include: {
        medias: mediaOrder,
      },
    });
  }

  remove(id: number) {
    return this.prisma.jewelry.update({
      where: {
        id,
      },
      data: {
        status: 'HIDDEN',
      },
    });
  }
}
