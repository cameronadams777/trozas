import { z } from "zod";

export const getConnectionDetailsResponseSchema = z.object({
  connectionDetails: z.object({
    instanceUrl: z.string(),
    apiToken: z.string(),
  }),
});

export const saveConnectionDetailsResponseSchema = z.object({
  connectionDetails: z.object({
    instanceUrl: z.string(),
    apiToken: z.string(),
  }),
});
