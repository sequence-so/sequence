import { AuthDiscordInstance } from "../../models/auth_discord";

export const transform = (model: AuthDiscordInstance) => {
  return {
    id: model.id,
    userId: model.userId,
    webhookId: model.webhookId,
    expiresAt: model.expiresAt,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
  };
};
