const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(3),

  email: z.string().email(),

  password: z.string().min(6),

  role: z.enum(["ADMIN", "USER"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),

  password: z.string().min(6),
});

const verifyRegisterOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

module.exports = {
  registerSchema,
  loginSchema,
  verifyRegisterOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};