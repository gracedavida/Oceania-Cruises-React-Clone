import { Resend } from "resend";
import type { CareerApplication } from "@workspace/api-zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const hiringInbox =
  process.env.HIRING_INBOX || "oceaniacareerjob@protonmail.com";

const senderEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";

function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n"]/g, " ").trim();
}

function buildApplicationText(application: CareerApplication): string {
  let additionalDetails = "(No additional application details provided)";

  if (application.applicationDetails?.trim()) {
    try {
      const parsedDetails = JSON.parse(
        application.applicationDetails,
      ) as Record<string, string>;

      additionalDetails = Object.entries(parsedDetails)
        .map(([label, value]) => `${label}: ${value}`)
        .join("\n");
    } catch {
      additionalDetails = application.applicationDetails.trim();
    }
  }

  return [
    "A new career application was submitted through the Oceania Cruises educational recreation.",
    "",
    `Applicant: ${application.fullName.toUpperCase()}`,
    `Email: ${application.email}`,
    `Phone: ${application.phone}`,
    `Position: ${application.position.toUpperCase()}`,
    "",
    "Applicant note:",
    application.note?.trim() || "(No note provided)",
    "",
    "Additional application details:",
    additionalDetails,
  ].join("\n");
}

export async function sendCareerApplication(
  application: CareerApplication,
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const text = buildApplicationText(application);

  const attachments =
    application.resumeName && application.resumeType && application.resumeData
      ? [
        {
          filename: sanitizeHeaderValue(application.resumeName),
          content: Buffer.from(application.resumeData, "base64"),
        },
      ]
      : undefined;

  const { error } = await resend.emails.send({
    from: `Oceania Cruises Careers <${senderEmail}>`,
    to: [hiringInbox],
    replyTo: sanitizeHeaderValue(application.email),
    subject: `New application — ${sanitizeHeaderValue(application.position.toUpperCase())} — ${sanitizeHeaderValue(application.fullName.toUpperCase())}`,
    text,
    attachments,
  });

  if (error) {
    throw new Error(`Resend email failed: ${error.message}`);
  }
}
