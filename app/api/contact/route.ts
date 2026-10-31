import { NextResponse } from "next/server";

const RESEND_URL = "https://api.resend.com/emails";
const TO = process.env.CONTACT_TO_EMAIL ?? "ranggadewa853@gmail.com";
const FROM =
  process.env.RESEND_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";
const MAX_MESSAGE = 5000;

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const data = payload as Record<string, unknown>;

  if (typeof data.website === "string" && data.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (message.length < 10 || message.length > MAX_MESSAGE) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  try {
    const response = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });

    if (!response.ok) {
      console.error("Resend error", response.status, await response.text());
      return NextResponse.json({ error: "delivery" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact route error", error);
    return NextResponse.json({ error: "delivery" }, { status: 502 });
  }
}
