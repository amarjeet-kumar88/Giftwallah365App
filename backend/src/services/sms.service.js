import client from "../config/twilio.js";

export const sendOtpSMS = async (phone, otp) => {
  await client.messages.create({
    body: `Your GiftWallah OTP is ${otp}`,
    from: process.env.TWILIO_PHONE,
    to: phone,
  });
};
