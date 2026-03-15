import { z } from "zod";

export const filterOptionsSchema = z.object({
  type: z.string().optional(),
  minQualityP: z.number().optional(),
  audioLanguage: z.string().optional(),
  providerWhitelist: z.array(z.string()).optional(),
  providerBlacklist: z.array(z.string()).optional(),
});

export type filterOptions = z.infer<typeof filterOptionsSchema>;
