-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "JewelryStatus" AS ENUM ('ACTIVE', 'SOLD_OUT', 'NEW_IN', 'PRE_ORDER', 'HIDDEN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Jewelry" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "material" TEXT NOT NULL DEFAULT 'Bạc S925',
    "stone" TEXT,
    "status" "JewelryStatus" NOT NULL DEFAULT 'ACTIVE',
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jewelry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "isThumbnail" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "jewelryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Jewelry_slug_key" ON "Jewelry"("slug");

-- CreateIndex
CREATE INDEX "Jewelry_status_idx" ON "Jewelry"("status");

-- CreateIndex
CREATE INDEX "Jewelry_createdAt_idx" ON "Jewelry"("createdAt");

-- CreateIndex
CREATE INDEX "Media_jewelryId_idx" ON "Media"("jewelryId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_jewelryId_fkey" FOREIGN KEY ("jewelryId") REFERENCES "Jewelry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
