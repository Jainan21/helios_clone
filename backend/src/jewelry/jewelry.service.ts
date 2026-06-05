import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJewelryDto } from './dto/create-jewelry.dto';
import { UpdateJewelryDto } from './dto/update-jewelry.dto';

import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service';

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
    })

    if (existed) {
      throw new BadRequestException('Slug already exists')
    }

    return this.prisma.jewelry.create({
      data: {
        name: dto.name,
        price: dto.price,
        description: dto.description,
        material: dto.material,
        stone: dto.stone,
        status: dto.status,
        slug: dto.slug,

        medias: dto.medias ? {
          create: dto.medias.map((media) => ({
            url: media.url,
            type: media.type,
            isThumbnail: media.isThumbnail ?? false,
            sortOrder: media.sortOrder ?? 0,
          })),
        } : undefined,
      },
      include: {
        medias: true,
      },
    })

  }

  async uploadMedia(file: any) {
    if (!file || !file.buffer) {
      throw new BadRequestException('File is required for upload')
    }

    return new Promise<{ url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'helios', resource_type: 'image' },
        (error, result) => {
          if (error) {
            reject(new BadRequestException(error.message))
            return
          }

          if (!result?.secure_url) {
            reject(new BadRequestException('Cloudinary upload failed'))
            return
          }

          resolve({ url: result.secure_url })
        },
      )

      uploadStream.end(file.buffer)
    })
  }

  async findAll(params: {
    status?: string
    search?: string
    page: number
    limit: number
  }) {
    const { status, search, page, limit } = params
    const skip = (page - 1) * limit
    const where: any = {
      status: {
        not: "HIDDEN"
      }
    }
    if (status) {
      where.status = status
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      }
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
          slug: true,
          medias: {
            select: {
              id: true,
              url: true,
              type: true,
              isThumbnail: true,
              sortOrder: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),

      this.prisma.jewelry.count({
        where,
      }),
    ])

    return {
      data: items,
      pagination: {
        total: total,
        page,
        limit,
        totalPage: Math.ceil(total / limit)
      }
    }
  }

  findOne(id: number) {
    return this.prisma.jewelry.findUniqueOrThrow({
      where: {
        id
      }
    });
  }

  update(id: number, updateJewelryDto: UpdateJewelryDto) {
    return `This action updates a #${id} jewelry`;
  }

  remove(id: number) {
    return this.prisma.jewelry.update({
      where: {
        id
      },
      data: {
        status: "HIDDEN"
      }
    })
  }
}
