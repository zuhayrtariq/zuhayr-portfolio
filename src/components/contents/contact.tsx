"use client";

import BrandIcon from "@/components/ui/brand-icon";
import { SITE } from "@/constants/site";
import { CONTACT_TOPIC_EVENT, CONTACT_TOPIC_KEY } from "@/lib/contact-topic";
import type { FormValues } from "@/lib/validators/form";
import { useMutation } from "@tanstack/react-query";
import { ArrowUpRightIcon, MailIcon, MessageCircleIcon, type LucideIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import Rise from "../motion/rise";
import ContactBackdrop from "./contact-backdrop";
import { Textarea } from "../ui/textarea";

const UpworkIcon = ({ className }: { className?: string }) => (
  <BrandIcon name="Upwork" colored={false} className={className} />
);

const CHANNELS: { label: string; value: string; href: string; Icon: LucideIcon | typeof UpworkIcon }[] = [
  { label: "Email", value: SITE.email, href: `mailto:${SITE.email}`, Icon: MailIcon },
  { label: "WhatsApp", value: SITE.phone, href: SITE.whatsapp, Icon: MessageCircleIcon },
  { label: "Upwork", value: "Hire me on Upwork", href: SITE.upwork, Icon: UpworkIcon },
];

const labelClass = "text-ui font-bold text-caption";
const messageClass = "text-fine font-bold text-error";

// Mirrors FormValidator, which the server enforces.
const rules = {
  name: {
    validate: (v: string) => (v.trim().length >= 2 ? true : "Enter your name"),
    maxLength: { value: 50, message: "Name must be at most 50 characters long" },
  },
  email: {
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
    required: "Enter a valid email address",
  },
  phone: { maxLength: { value: 30, message: "Phone number is too long" } },
  message: {
    validate: (v: string) => (v.trim().length >= 10 ? true : "Add a sentence or two about your project"),
    maxLength: { value: 2000, message: "Message must be at most 2000 characters long" },
  },
};

const Contact = () => {
  const form = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  useEffect(() => {
    // What the site last wrote into the message, so a newer handoff may replace it but never the visitor's own words.
    let written = "";
    const prefill = (topic: string | null) => {
      const current = form.getValues("message");
      if (!topic || (current && current !== written)) return;
      // One line is a topic to put in a sentence; several lines are a message already.
      written = topic.includes("\n") ? topic : `I'd like to talk about ${topic.replace(/[.\s]+$/, "")}.`;
      form.setValue("message", written);
    };
    prefill(sessionStorage.getItem(CONTACT_TOPIC_KEY));
    const onTopic = (e: Event) => prefill((e as CustomEvent<string>).detail);
    window.addEventListener(CONTACT_TOPIC_EVENT, onTopic);
    return () => window.removeEventListener(CONTACT_TOPIC_EVENT, onTopic);
  }, [form]);

  const { mutate: send, isPending, isSuccess, isError, reset } = useMutation({
    mutationFn: async (values: FormValues) => {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => formData.set(k, v));
      const res = await fetch("/api/send", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Request failed");
      return res.json();
    },
    onSuccess: () => form.reset(),
  });

  return (
    <section id="contact" aria-labelledby="contact-title" className="on-ember relative isolate overflow-hidden">
      <ContactBackdrop />
      <div className="mx-auto max-w-[1680px] px-[clamp(16px,4vw,64px)] pt-24 md:pt-36">
        <Rise
          as="h2"
          by="lines"
          id="contact-title"
          className="font-display text-[length:32.6vw] leading-[0.8] tracking-[-0.02em] min-[1680px]:text-[length:536px]"
        >
          Your turn.
        </Rise>
      </div>
      <div className="mx-auto grid max-w-[1680px] gap-12 px-[clamp(16px,4vw,64px)] pb-24 pt-14 lg:grid-cols-12 lg:gap-x-8 lg:pb-36 lg:pt-20">
        <div className="lg:col-span-5">
          <p className="max-w-[30ch] text-[clamp(24px,2.2vw,34px)] leading-[1.2]">
            Describe what you need built: a new product, a feature for the app you have, or a
            project that&apos;s slipping and needs to land. I&apos;ll reply by email with how I&apos;d build
            it and when it could go live.
          </p>
          <ul className="mt-10 max-w-[30rem] space-y-3">
            {CHANNELS.map(({ label, value, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  className="on-ink group/channel flex items-center gap-4 rounded-[22px] bg-ink p-3 pr-5 shadow-[0_24px_50px_-24px_rgb(59_20_8/0.8),inset_0_1px_0_rgb(255_255_255/0.08)] transition-transform duration-500 ease-[var(--ease-lights)] hover:translate-x-1.5"
                >
                  <span className="grid size-13 shrink-0 place-items-center rounded-2xl bg-white/8 text-caption transition-colors duration-300 group-hover/channel:bg-ember group-hover/channel:text-ink">
                    <Icon aria-hidden className="size-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-fine text-fog">{label}</span>
                    <span className="block truncate text-body font-bold leading-tight">{value}</span>
                  </span>
                  <ArrowUpRightIcon
                    aria-hidden
                    className="size-5 shrink-0 transition-transform duration-500 ease-[var(--ease-lights)] group-hover/channel:-translate-y-0.5 group-hover/channel:translate-x-0.5"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="on-ink relative rounded-[28px] bg-ink p-6 shadow-[0_50px_100px_-30px_rgb(59_20_8/0.75),inset_0_1px_0_rgb(255_255_255/0.08)] sm:p-9 lg:col-span-7 lg:rounded-[36px] lg:p-12">
          {isSuccess ? (
            <div role="status" className="flex h-full flex-col justify-center">
              <h3 className="font-display text-q-sm leading-none font-semibold md:text-q">Message sent</h3>
              <p className="mt-4 max-w-md text-body text-fog">
                Thanks for writing. I&apos;ll reply to the email address you gave.
              </p>
              <button type="button" onClick={() => reset()} className="link-underline mt-8 w-fit text-ui font-bold">
                Send another message
              </button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit((values) => send(values))} className="space-y-6" noValidate>
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={rules.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} autoComplete="name" />
                        </FormControl>
                        <FormMessage className={messageClass} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    rules={rules.email}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            inputMode="email"
                            disabled={isPending}
                            autoComplete="email"
                            spellCheck={false}
                          />
                        </FormControl>
                        <FormMessage className={messageClass} />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="phone"
                  rules={rules.phone}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>
                        Phone or WhatsApp <span className="font-normal text-fog">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" inputMode="tel" disabled={isPending} autoComplete="tel" />
                      </FormControl>
                      <FormMessage className={messageClass} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  rules={rules.message}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>About your project</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={5}
                          disabled={isPending}
                          placeholder="What do you need built, and when do you need it live?"
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage className={messageClass} />
                    </FormItem>
                  )}
                />

                {isError && (
                  <p role="alert" className="text-ui text-error">
                    Your message couldn&apos;t be sent. Try again, or email me at {SITE.email}.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex h-14 w-full items-center justify-center rounded-full bg-signal px-10 text-ui font-bold text-ink transition-colors duration-300 hover:bg-caption disabled:opacity-60 sm:w-auto"
                >
                  {isPending ? "Sending…" : "Send message"}
                </button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
