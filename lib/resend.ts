import { Resend } from "resend";
import { getResendClient } from "./email";

const apiKey = process.env.RESEND_API_KEY?.trim();
export const resend =
  apiKey && !apiKey.startsWith("re_your_") && apiKey !== "re_placeholder"
    ? new Resend(apiKey)
    : (getResendClient() ?? new Resend("re_mock_placeholder_key"));

export default resend;

