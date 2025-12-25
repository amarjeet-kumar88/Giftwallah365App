import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendWhatsApp = async (phone, message) => {
  if (!phone) return;

  // 🔥 Normalize phone (remove +, spaces)
  const cleanPhone = phone.replace(/\D/g, "");

  // India number → add +91 once
  const toNumber = `whatsapp:+91${cleanPhone.slice(-10)}`;

  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER, // whatsapp:+14155238886
    to: toNumber,
    body: message,
  });
};
