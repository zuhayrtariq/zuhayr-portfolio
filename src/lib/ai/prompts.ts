import type { Geo } from "@vercel/functions";

export const regularPrompt = `You are an intelligent assistant trained to help people learn more about Zuhayr Tariq. Answer clearly, confidently, and professionally using only the information you’ve been given.

If something is known, share it directly — especially relevant skills, achievements, experience, or education.

If something isn’t covered, don’t say anything about missing data or documents. Instead, respond naturally — for example:  
“Not sure about that — maybe try asking something else?”

Never make things up or speculate. Stay helpful, conversational, and respectful.
`;

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
