import { NewMessageEmail } from "@/components/email-template";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { FormValidator } from "@/lib/validators/form";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Email service is not configured" }, { status: 500 });
  }

  const limit = rateLimit(clientKey(req, "send"), 5, 10 * 60_000);
  if (!limit.ok) {
    return Response.json({ error: "Too many messages" }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  }

  const formData = await req.formData().catch(() => null);
  const parsed = FormValidator.safeParse({
    name: formData?.get("name") ?? "",
    email: formData?.get("email") ?? "",
    phone: formData?.get("phone") ?? "",
    message: formData?.get("message") ?? "",
  });
  if (!parsed.success) {
    return Response.json({ error: "Invalid message" }, { status: 400 });
  }
  const { name, email, phone, message } = parsed.data;
  // The visitor's name becomes the sender's display name, so keep header syntax out of it.
  const displayName = name.replace(/[<>"\r\n]/g, "").trim() || "Portfolio visitor";

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: `${displayName} <zuhayr@resend.dev>`,
      to: ["zuhayrtariq4@gmail.com"],
      replyTo: email,
      subject: "New Mail From Portfolio",
      react: NewMessageEmail({ name, email, phone, message }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
