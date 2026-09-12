import client from "../config/twilio.js";
import env from "../config/env.js";

export const sendOtpSMS = async (phone, otp) => {
  await client.messages.create({
    body: `Your GiftWallah OTP is ${otp}`,
    from: env.TWILIO_PHONE,
    to: phone,
  });
};