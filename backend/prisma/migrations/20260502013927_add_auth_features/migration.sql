-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerificationOtp" TEXT,
ADD COLUMN     "emailVerificationOtpExpiry" TIMESTAMP(3),
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordResetOtp" TEXT,
ADD COLUMN     "passwordResetOtpExpiry" TIMESTAMP(3),
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);
