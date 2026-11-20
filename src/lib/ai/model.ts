import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";

/** The model behind the site's AI: Claude when its key is set, otherwise OpenAI, otherwise none. */
export const siteModel = () => {
  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic(process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5");
  }
  if (process.env.OPENAI_API_KEY) {
    return openai(process.env.OPENAI_MODEL ?? "gpt-5.4-mini");
  }
  return null;
};
