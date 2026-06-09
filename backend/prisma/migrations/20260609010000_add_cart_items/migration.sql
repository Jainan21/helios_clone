CREATE TABLE "CartItem" (
  "id" SERIAL NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "userId" INTEGER NOT NULL,
  "jewelryId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CartItem_userId_jewelryId_key" ON "CartItem"("userId", "jewelryId");
CREATE INDEX "CartItem_userId_idx" ON "CartItem"("userId");
CREATE INDEX "CartItem_jewelryId_idx" ON "CartItem"("jewelryId");

ALTER TABLE "CartItem"
ADD CONSTRAINT "CartItem_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CartItem"
ADD CONSTRAINT "CartItem_jewelryId_fkey"
FOREIGN KEY ("jewelryId") REFERENCES "Jewelry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
