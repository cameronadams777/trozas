import { invoke } from "@tauri-apps/api";
import { IConnectionDetails } from "src/types";
import { z } from "zod";
import { getConnectionDetailsResponseSchema, saveConnectionDetailsResponseSchema } from "./schemas";

export const getConnectionDetails = async (): Promise<IConnectionDetails> => {
  const connectionDetails = await invoke<z.infer<typeof getConnectionDetailsResponseSchema>>("get_connection_details");
  getConnectionDetailsResponseSchema.parse(connectionDetails);
  return connectionDetails;
}

interface ISaveConnectionDetailsInput {
  instanceUrl: string;
  apiToken: string;
}

export const saveConnectionDetails = async ({ instanceUrl, apiToken }: ISaveConnectionDetailsInput): Promise<IConnectionDetails> => {
  const connectionDetails = await invoke<z.infer<typeof saveConnectionDetailsResponseSchema>>(
    "save_connection_details",
    {
      instanceUrl,
      apiToken
    }
  );
  saveConnectionDetailsResponseSchema.parse(connectionDetails);
  return connectionDetails;
}
