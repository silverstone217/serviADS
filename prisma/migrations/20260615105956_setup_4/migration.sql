-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('flexpaie', 'cinetpay', 'mpesa', 'cash', 'bank');

-- AlterTable
ALTER TABLE "AudioSubscriber" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'flexpaie',
ADD COLUMN     "paymentRef" TEXT;
