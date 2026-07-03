const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("../services/email.service");
const { generateOtp, getOtpHtml } = require("../utils/util");
const otpmodel = require("../models/otp");
const { authLimiter, otpLimiter } = require("../middleware/rateLimiter");

const User = require("../models/User");
const Session = require("../models/Session");

const router = express.Router();

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const createAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });

const createRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

router.post("/register", authLimiter, async (req, res) => {
  try {
    const { username, email, password, nationality, address, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, Email and Password required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: "Email or Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, nationality, address, role });

    const otp = generateOtp();
    const html = getOtpHtml(otp);
    const tenMinutesFromNow = new Date(Date.now() + 10 * 60 * 1000);
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    await otpmodel.create({ email, user: user._id, otpHash, expiresAt: tenMinutesFromNow });
    await sendEmail(email, "OTP Verification", `your otp code is ${otp}`, html);

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(201).json({ message: "User registered successfully", user: safeUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid email or password" });

    const refreshToken = createRefreshToken({ id: user._id });
    const session = await Session.create({
      user: user._id,
      refreshTokenHash: hashToken(refreshToken),
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    const accessToken = createAccessToken({ id: user._id, sessionId: session._id, role: user.role });
    res.cookie("refreshToken", refreshToken, refreshCookieOptions());

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ accessToken, user: safeUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    res.json(user);
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.get("/refresh-token", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const session = await Session.findOne({ refreshTokenHash: hashToken(refreshToken), revoked: false });
    if (!session) return res.status(403).json({ message: "Session invalid" });

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(403).json({ message: "Session invalid" });

    const newRefreshToken = createRefreshToken({ id: user._id });
    session.refreshTokenHash = hashToken(newRefreshToken);
    await session.save();

    const accessToken = createAccessToken({ id: user._id, sessionId: session._id, role: user.role });
    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions());

    res.json({ accessToken });
  } catch {
    res.status(403).json({ message: "Refresh token invalid" });
  }
});

router.get("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await Session.updateOne({ refreshTokenHash: hashToken(refreshToken) }, { revoked: true });
    }
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/verify-email", otpLimiter, async (req, res) => {
  try {
    const { otp, email } = req.body;
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const otpDoc = await otpmodel.findOne({ email, otpHash });

    if (!otpDoc) return res.status(400).json({ message: "Invalid Otp" });

    if (new Date() > otpDoc.expiresAt) {
      await otpmodel.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ message: "OTP has expired" });
    }

    await User.findByIdAndUpdate(otpDoc.user, { verified: true });
    await otpmodel.deleteMany({ user: otpDoc.user });
    return res.status(200).json({ message: "Email Verified" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/forgot-password", otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });

    if (user) {
      const otp = generateOtp();
      const html = getOtpHtml(otp);
      const tenMinutesFromNow = new Date(Date.now() + 10 * 60 * 1000);
      const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

      await otpmodel.deleteMany({ email });
      await otpmodel.create({ email, user: user._id, otpHash, expiresAt: tenMinutesFromNow });
      await sendEmail(email, "Password Reset OTP", `Your password reset OTP is ${otp}`, html);
    }

    res.status(200).json({ message: "If an account exists for this email, an OTP has been sent." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/reset-password", otpLimiter, async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const otpDoc = await otpmodel.findOne({ email, otpHash });
    if (!otpDoc) return res.status(400).json({ message: "Invalid OTP" });

    if (new Date() > otpDoc.expiresAt) {
      await otpmodel.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ message: "OTP has expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(otpDoc.user, { password: hashedPassword });
    await otpmodel.deleteMany({ user: otpDoc.user });
    await Session.updateMany({ user: otpDoc.user }, { revoked: true });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;