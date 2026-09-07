import { Router, type IRouter } from "express";
import {
  SubmitCareerApplicationBody,
  SubmitCareerApplicationResponse,
} from "@workspace/api-zod";
import { sendCareerApplication } from "../lib/gmail";

const router: IRouter = Router();

router.post("/careers/applications", async (req, res): Promise<void> => {
  const parsed = SubmitCareerApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.flatten() }, "Invalid career application");
    res.status(400).json({ error: "Please check the application details and resume." });
    return;
  }

  const decodedResume = Buffer.from(parsed.data.resumeData, "base64");
  if (decodedResume.length !== parsed.data.resumeSize) {
    res.status(400).json({ error: "The resume upload was incomplete. Please try again." });
    return;
  }

  try {
    await sendCareerApplication(parsed.data);
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
  }
});

export default router;