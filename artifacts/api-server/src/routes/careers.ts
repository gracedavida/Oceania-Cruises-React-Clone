import { Router, type IRouter } from "express";
import {
  SubmitCareerApplicationBody,
  SubmitCareerApplicationResponse,
} from "@workspace/api-zod";
import { sendCareerApplication } from "../lib/gmail";

const router: IRouter = Router();
const processingEmails = new Set<string>();
const submittedEmails = new Set<string>();

router.post("/careers/applications", async (req, res): Promise<void> => {
  const parsed = SubmitCareerApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.flatten() }, "Invalid career application");
    res.status(400).json({ error: "Please check the application details and resume." });
    return;
  }

  const normalizedEmail = parsed.data.email.trim().toLowerCase();
  if (processingEmails.has(normalizedEmail) || submittedEmails.has(normalizedEmail)) {
    res.status(409).json({
      error: "An application from this email address has already been submitted.",
    });
    return;
  }

  const resumeFields = [
    parsed.data.resumeName,
    parsed.data.resumeType,
    parsed.data.resumeData,
    parsed.data.resumeSize,
  ];
  const hasAnyResumeField = resumeFields.some((field) => field !== undefined);
  const hasCompleteResume = resumeFields.every((field) => field !== undefined);
  if (hasAnyResumeField && !hasCompleteResume) {
    res.status(400).json({ error: "Please upload a complete resume file or leave the resume blank." });
    return;
  }
  if (hasCompleteResume) {
    const decodedResume = Buffer.from(parsed.data.resumeData!, "base64");
    if (decodedResume.length !== parsed.data.resumeSize) {
      res.status(400).json({ error: "The resume upload was incomplete. Please try again." });
      return;
    }
  }

  processingEmails.add(normalizedEmail);
  try {
    await sendCareerApplication(parsed.data);
    submittedEmails.add(normalizedEmail);
    res.json(
      SubmitCareerApplicationResponse.parse({
        status: "sent",
        message: "Application emailed successfully.",
      }),
    );
  } catch (error) {
    req.log.error({ err: error }, "Failed to email career application");
    res.status(502).json({
      error: "We could not send the application email. Please try again shortly.",
    });
  } finally {
    processingEmails.delete(normalizedEmail);
  }
});

export default router;