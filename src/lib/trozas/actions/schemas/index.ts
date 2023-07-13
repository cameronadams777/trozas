import { z } from "zod";

export const getConnectionDetailsResponseSchema = z.object({
  instanceUrl: z.string(),
  apiToken: z.string(),
});

export const saveConnectionDetailsResponseSchema = z.object({
  instanceUrl: z.string(),
  apiToken: z.string(),
});
