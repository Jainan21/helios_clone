-- AlterTable
ALTER TABLE "Jewelry" ADD COLUMN     "collectionId" INTEGER;

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "collectionId" INTEGER,
ALTER COLUMN "jewelryId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Collection" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Jewelry_collectionId_idx" ON "Jewelry"("collectionId");

-- CreateIndex
CREATE INDEX "Media_collectionId_idx" ON "Media"("collectionId");

-- AddForeignKey
ALTER TABLE "Jewelry" ADD CONSTRAINT "Jewelry_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
