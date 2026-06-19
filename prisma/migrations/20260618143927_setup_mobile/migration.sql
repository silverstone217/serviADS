-- CreateTable
CREATE TABLE "TaxiUser" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_banned" BOOLEAN NOT NULL DEFAULT false,
    "ban_reason" TEXT,
    "ban_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxiUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaxiUser_email_key" ON "TaxiUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TaxiUser_phone_key" ON "TaxiUser"("phone");
