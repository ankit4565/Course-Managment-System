const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const prisma = require("../config/db");
const {
  registerSchema,
  loginSchema,
  verifyRegisterOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validations/auth.validation");
const {
  sendEmail,
  registrationOtpEmail,
  forgotPasswordOtpEmail,
  passwordResetSuccessEmail,
} = require("../utils/email");

const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || "10", 10);

const createOtp = () => crypto.randomInt(100000, 1000000).toString();

const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

const getOtpExpiry = () => new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

const register = async (req, res, next) =>{
  try {
    const validatedData =
  registerSchema.parse(req.body);

const { name, email, password, role } =
  validatedData;

    // check missing fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check existing user
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const otp = createOtp();
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        isEmailVerified: false,
        emailVerificationOtp: hashOtp(otp),
        emailVerificationOtpExpiry: getOtpExpiry(),
      },
    });

    try {
      await sendEmail(
        email,
        "Verify your email",
        registrationOtpEmail(otp)
      );
    } catch (emailError) {
      await prisma.user.delete({
        where: { id: user.id },
      });

      return res.status(500).json({
        success: false,
        message: "Failed to send verification OTP",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Registration OTP sent to your email",
      verificationRequired: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {  
     next(error)
  }
};

const verifyRegisterOtp = async (req, res, next) => {
  try {
    const validatedData = verifyRegisterOtpSchema.parse(req.body);
    const { email, otp } = validatedData;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    const otpHash = hashOtp(otp);

    if (
      user.emailVerificationOtp !== otpHash ||
      !user.emailVerificationOtpExpiry ||
      user.emailVerificationOtpExpiry < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationOtp: null,
        emailVerificationOtpExpiry: null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // check fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // find user
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email with the OTP sent to you",
      });
    }

    // compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // generate token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const validatedData = forgotPasswordSchema.parse(req.body);
    const { email } = validatedData;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = createOtp();
    const otpHash = hashOtp(otp);

    // Set token expiry
    const passwordResetOtpExpiry = getOtpExpiry();

    // Update user with reset OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetOtp: otpHash,
        passwordResetOtpExpiry,
      },
    });

    // Send OTP email
    try {
      await sendEmail(
        email,
        "Password Reset OTP",
        forgotPasswordOtpEmail(otp)
      );
    } catch (emailError) {
      console.error("Email send error:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send reset email",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email",
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);
    const { email, otp, newPassword } = validatedData;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const otpHash = hashOtp(otp);

    if (
      user.passwordResetOtp !== otpHash ||
      !user.passwordResetOtpExpiry ||
      user.passwordResetOtpExpiry < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear reset token
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        isEmailVerified: true,
        passwordResetOtp: null,
        passwordResetOtpExpiry: null,
      },
    });

    // Send confirmation email
    try {
      await sendEmail(
        updatedUser.email,
        "Password Reset Successful",
        passwordResetSuccessEmail()
      );
    } catch (emailError) {
      console.error("Email send error:", emailError);
    }

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Verify passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords don't match",
      });
    }

    // Get user from request (from auth middleware)
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify old password
    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyRegisterOtp,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
};