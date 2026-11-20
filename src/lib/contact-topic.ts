import { getLenis } from "@/lib/lenis";

/** Where the AI leaves the visitor's project topic for the contact form. */
export const CONTACT_TOPIC_KEY = "contact-topic";
export const CONTACT_TOPIC_EVENT = "contact-topic";

/**
 * Leaves a topic, or a whole message of several lines, for the contact form
 * and takes the visitor there.
 */
export const handToContact = (text: string) => {
  sessionStorage.setItem(CONTACT_TOPIC_KEY, text);
  window.dispatchEvent(new CustomEvent(CONTACT_TOPIC_EVENT, { detail: text }));
  const lenis = getLenis();
  if (lenis) lenis.scrollTo("#contact");
  else document.querySelector("#contact")?.scrollIntoView();
};
