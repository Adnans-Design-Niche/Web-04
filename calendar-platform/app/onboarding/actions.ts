"use server";

import { requireUser } from "../lib/hooks";
import { onboardingSchema } from "./../lib/zodSchemas";
import { parseWithZod } from "@conform-to/zod";
import prisma from "../lib/db";

export async function OnboardingAction(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: onboardingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.user.update({
    where: { id: session.user?.id },
    data: { userName: submission.value.userName, name: submission.value.fullName },
  });

  formData.get("username");
}