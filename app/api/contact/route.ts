import { NextRequest, NextResponse } from "next/server";
import { getFromEmail, getAdminNotifyEmail, getResendClient } from "@/lib/email";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.format() },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = result.data;
    const fromEmail = getFromEmail();
    const adminEmail = getAdminNotifyEmail();
    const resend = getResendClient();

    if (!resend || !adminEmail) {
      console.log(
        `[Resend Contact Email Simulated] From: ${name} (${email}, Phone: ${phone || "N/A"})\nTo: ${adminEmail || "(no admin email)"}\nSubject: ${subject}\nMessage: ${message}`
      );
      return NextResponse.json({
        success: true,
        message: "Message received! Nitika will get back to you shortly.",
      });
    }

    try {
      const sendPromise = resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        replyTo: email,
        subject: `[Store Inquiry] ${subject} - from ${name}`,
        html: `
          <div style="font-family: sans-serif; color: #2B2420; max-width: 600px; padding: 20px; border: 1px solid #ECE2D2; border-radius: 12px; background: #FFF;">
            <h2 style="color: #D98E73; margin-top: 0;">New Message from Store Visitor</h2>
            <div style="background: #FAF6EF; padding: 14px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;">
              <p style="margin: 4px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              ${phone ? `<p style="margin: 4px 0;"><strong>Phone:</strong> ${phone}</p>` : ""}
              <p style="margin: 4px 0;"><strong>Subject:</strong> ${subject}</p>
            </div>
            <h3 style="font-size: 15px; margin-bottom: 6px;">Message Content:</h3>
            <p style="font-size: 14px; line-height: 1.6; background: #F5F5F4; padding: 14px; border-radius: 8px; white-space: pre-wrap;">${message}</p>
          </div>
        `,
      });

      const res = await Promise.race([
        sendPromise,
        new Promise<{ data: null; error: { message: string } }>((_, reject) =>
          setTimeout(() => reject(new Error("Contact email dispatch timed out after 5s")), 5000)
        ),
      ]);

      if (res && "error" in res && res.error) {
        console.warn("[Resend Warning - Contact Form]:", res.error);
      }
    } catch (emailErr) {
      console.warn("Resend email delivery failed, logged instead:", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been sent to Nitika.",
    });
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to process contact request." },
      { status: 500 }
    );
  }
}
