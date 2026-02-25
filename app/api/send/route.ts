import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json(
        { error: "Email is not configured" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const from =
      process.env.EMAIL_FROM || "Tani/Lei <hello@tanilei.com>";
    const notifyEmail =
      process.env.NOTIFY_EMAIL || "delivered@resend.dev";
    const alsoNotify = "tanileibeauty@outlook.com";

    // Notify the business of the new signup (to primary + Outlook)
    const { data: notifyData, error: notifyError } = await resend.emails.send({
      from,
      to: [notifyEmail, alsoNotify],
      subject: `[Tani/Lei] New booking request from ${email}`,
      html: `
        <p>A visitor requested early access / priority booking.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>Reply to this address to follow up.</p>
      `,
    });

    if (notifyError) {
      console.error("Resend notify error:", notifyError);
      return NextResponse.json(
        { error: "Failed to send notification" },
        { status: 500 }
      );
    }

    // Optional: send a short confirmation to the user (BCC Outlook so they get all emails)
    const { error: confirmError } = await resend.emails.send({
      from,
      to: [email],
      bcc: [alsoNotify],
      subject: "We received your request — Tani/Lei",
      html: `
        <p>Thank you for your interest in Tani/Lei.</p>
        <p>We've received your email and will be in touch soon with early access and your complimentary beauty consultation.</p>
        <p>— The Tani/Lei team</p>
      `,
    });

    if (confirmError) {
      console.warn("Resend confirmation error (notification still sent):", confirmError);
    }

    return NextResponse.json({
      success: true,
      id: notifyData?.id,
    });
  } catch (err) {
    console.error("Send API error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
