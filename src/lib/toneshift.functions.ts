import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { rewriteWithAI } from "./toneshift.server";

export const rewriteMessage = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({
      input: z.string().trim().min(1).max(500),
      tone: z.enum(["casual", "friendly", "professional", "diplomatic", "ice"]),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    try {
      return { ok: true as const, ...(await rewriteWithAI(data.input, data.tone)) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Something went wrong." };
    }
  });
