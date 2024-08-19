import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

export const searchEmails = async (auth: OAuth2Client, query: string) => {
  const gmail = google.gmail({ version: "v1", auth });
  const res = await gmail.users.messages.list({
    userId: "me",
    q: query,
  });
  const messages = res.data.messages || [];

  return Promise.all(
    messages.map(async (message) => {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id!,
      });
      return {
        id: msg.data.id,
        snippet: msg.data.snippet,
        payload: msg.data.payload,
      };
    })
  );
};
