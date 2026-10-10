// Server-only. Never import this from client code; load it with `await import()` inside server functions.
import nodemailer from "nodemailer";

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  senderName: string;
}

export interface MailMessage {
  to: string;
  subject: string;
  /** Plain text only: lead data is untrusted and must never be rendered as HTML. */
  text: string;
  replyTo?: string;
}

/** The SMTP password never lives in the database or the browser: it is a server environment variable. */
export function smtpPassword(): string | undefined {
  return process.env.SMTP_PASS?.trim() || undefined;
}

export async function sendMail(config: SmtpConfig, message: MailMessage): Promise<void> {
  const pass = smtpPassword();
  if (!config.host || !config.user) throw new Error("SMTP host and username are not set.");
  if (!pass) throw new Error("The SMTP_PASS environment variable is not set on the server.");

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port || 587,
    secure: config.port === 465,
    auth: { user: config.user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  await transporter.sendMail({
    from: `"${config.senderName.replace(/"/g, "")}" <${config.user}>`,
    to: message.to,
    replyTo: message.replyTo,
    subject: message.subject.replace(/[\r\n]+/g, " ").slice(0, 200),
    text: message.text,
  });
}
