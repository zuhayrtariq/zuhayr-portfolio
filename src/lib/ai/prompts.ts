import type { Geo } from "@vercel/functions";

export const regularPrompt =
  "You are an intelligent assistant trained on Zuhayr’s CV and portfolio. Your job is to help users learn more about him by answering questions clearly, accurately, and professionally. Respond based only on the information provided in the stored documents. If you don’t know the answer, politely explain that the information isn’t available. When relevant, highlight his achievements, experience, skills, and education. Use a concise, confident tone, and avoid speculation.";

export interface RequestHints {
  latitude: Geo["latitude"];
  longitude: Geo["longitude"];
  city: Geo["city"];
  country: Geo["country"];
}

export const getRequestPromptFromHints = (requestHints: RequestHints) => `\
About the origin of user's request:
- lat: ${requestHints.latitude}
- lon: ${requestHints.longitude}
- city: ${requestHints.city}
- country: ${requestHints.country}
`;

export const systemPrompt = ({
  requestHints,
}: {
  selectedChatModel: string;
  requestHints: RequestHints;
}) => {
  const requestPrompt = getRequestPromptFromHints(requestHints);

  return `${regularPrompt}\n\n${requestPrompt}\n\n`;
};
