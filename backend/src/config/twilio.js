import twilio from "twilio";
import env from "./env.js";

const client = twilio(
  env.TWILIO_SID,
  env.TWILIO_AUTH_TOKEN
);

export default client;
