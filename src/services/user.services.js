import { User, Otp } from "../models/index.js";
import bcrypt from "bcrypt"
import { Op } from "sequelize";
import crypto from "crypto"

export const registerUser = async (data) => {
  const { name, email, phoneNumber, password, referralCode, role } = data;

  //`1 Validate email OR phoneNumber
  if (!email && !phoneNumber) {
    throw new Error("Email or phoneNumber number is required");
  }

  // Check duplicate email or phoneNumber
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [
        email ? { email } : null,
        phoneNumber ? { phoneNumber } : null
      ].filter(Boolean)
    }
  });

  if (existingUser) {
    throw new Error("Email or phoneNumber already registered");
  }

  // Validate referral code (if provided)
  let referredBy = null;

  if (referralCode) {
    const refUser = await User.findOne({
      where: { referralCode }
    });

    if (!refUser) {
      throw new Error("Invalid referral code");
    }

    referredBy = refUser.id;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate user's own referral code
  const generatedReferralCode = crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase();

  // Create user (unverified)
  const user = await User.create({
    name,
    email: email || null,
    phoneNumber: phoneNumber || null,
    password: hashedPassword,
    referralCode: generatedReferralCode,
    referredBy,
    isVerified: false, 
    role
  });

  // Generate OTP (6 digits)
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await Otp.create({
    userId: user.id,
    code: otpCode,
    expiresAt
  });

  // In real app → send OTP via email service
  console.log("Generated OTP:", otpCode);

  return {
    message: "User registered. Verify OTP.",
    userId: user.id
  };
};

export const verifyOtp = async ({ email, phoneNumber, code }) => {

  //  Require identifier + OTP
  if ((!email && !phoneNumber) || !code) {
    throw new Error("Email or phoneNumber and OTP code are required");
  }

  // Find user
  const user = await User.findOne({
    where: {
      [Op.or]: [
        email ? { email } : null,
        phoneNumber ? { phoneNumber } : null
      ].filter(Boolean)
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("User already verified");
  }

  // Find latest unused OTP
  const otpRecord = await Otp.findOne({
    where: {
      userId: user.id,
      code,
      isUsed: false
    },
    order: [["createdAt", "DESC"]]
  });

  if (!otpRecord) {
    throw new Error("Invalid OTP");
  }

  // Check expiry
  if (otpRecord.expiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  // Mark OTP as used
  otpRecord.isUsed = true;
  await otpRecord.save();

  // Verify user
  user.isVerified = true;
  await user.save();

  const { password: _, ...safeUser } = user.toJSON();

  return safeUser;
};

export const getUsers = async () => {
  const user = await User.findAll();
  const safeUsers = user.map(u => {
    const { password: _, ...safeUser } = u.toJSON();
    return safeUser
  })
  return safeUsers;
}

