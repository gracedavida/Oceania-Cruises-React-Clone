import { ReplitConnectors } from "@replit/connectors-sdk";
import type { CareerApplication } from "@workspace/api-zod";

const hiringInbox = "Oceaniacruisesapplication@protonmail.com";

function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n"]/g, " ").trim();
}

function wrapBase64(value: string): string {
  return value.match(/.{1,76}/g)?.join("\r\n") ?? value;
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function buildApplicationMessage(
  application: CareerApplication,
  sender: string,
): string {
  const boundary = `----=_OceaniaApplication_${crypto.randomUUID()}`;
  const safeName = sanitizeHeaderValue(application.fullName);
  const safePosition = sanitizeHeaderValue(application.position);
  const safeResumeName = sanitizeHeaderValue(application.resumeName);
  const body = [
    "A new career application was submitted through the Oceania Cruises educational recreation.",
    "",
    `Applicant: ${application.fullName}`,
    `Email: ${application.email}`,
    `Position: ${application.position}`,
    "",
    "Applicant note:",
    application.note?.trim() || "(No note provided)",
  ].join("\r\n");

  const headers = [
    `From: Oceania Cruises Careers <${sender}>`,
    `To: ${hiringInbox}`,
    `Reply-To: ${sanitizeHeaderValue(application.email)}`,
    `Subject: New application — ${safePosition} — ${safeName}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
  ].join("\r\n");

  const attachment = [
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    body,
    "",
    `--${boundary}`,
    `Content-Type: ${application.resumeType}; name="${safeResumeName}"`,
    "Content-Transfer-Encoding: base64",
    `Content-Disposition: attachment; filename="${safeResumeName}"`,
    "",
    wrapBase64(application.resumeData),
    "",
    `--${boundary}--`,
    "",
  ].join("\r\n");

  return `${headers}\r\n\r\n${attachment}`;
}

export async function sendCareerApplication(
  application: CareerApplication,
): Promise<void> {
  const connectors = new ReplitConnectors();
  const profileResponse = await connectors.proxy(
    "google-mail",
    "/gmail/v1/users/me/profile",
    { method: "GET" },
  );

  if (!profileResponse.ok) {
    throw new Error(`Gmail profile request failed with ${profileResponse.status}`);
  }

  const profile = (await profileResponse.json()) as { emailAddress?: string };
  if (!profile.emailAddress) {
    throw new Error("Gmail profile did not include a sender address");
  }

  const message = buildApplicationMessage(application, profile.emailAddress);
  const sendResponse = await connectors.proxy(
    "google-mail",
    "/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ raw: encodeBase64Url(message) }),
    },
  );

  if (!sendResponse.ok) {
    const details = (await sendResponse.text()).slice(0, 300);
    throw new Error(
      `Gmail send request failed with ${sendResponse.status}: ${details}`,
    );
  }
}