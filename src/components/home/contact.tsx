"use client";

import BrandIcon from "@/components/ui/brand-icon";
import { SITE } from "@/constants/site";
import { CONTACT_TOPIC_EVENT, CONTACT_TOPIC_KEY } from "@/lib/contact-topic";
import type { FormValues } from "@/lib/validators/form";
import { useMutation } from "@tanstack/react-query";
import { MailIcon, MessageCircleIcon, type LucideIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const UpworkIcon = ({ className }: { className?: string }) => (
  <BrandIcon name="Upwork" colored={false} className={className} />
);

const CHANNELS: { label: string; value: string; href: string; Icon: LucideIcon | typeof UpworkIcon }[] = [
  { label: "Email", value: SITE.email, href: `mailto:${SITE.email}`, Icon: MailIcon },
  { label: "WhatsApp", value: SITE.phone, href: SITE.whatsapp, Icon: MessageCircleIcon },
  { label: "Upwork", value: "Hire me on Upwork", href: SITE.upwork, Icon: UpworkIcon },
];

const labelClass = "text-fine font-bold text-caption";
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

/** The way in: the contact form, and beside it the other ways to reach him. */
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
    <section id="contact" aria-labelledby="contact-title" className="on-emerald relative overflow-hidden bg-emerald">
      <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] py-24 md:py-36">
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-end">
          <h2 id="contact-title" className="text-[clamp(38px,5.5vw,96px)] lg:col-span-7">
            Tell me what you&apos;re building.
          </h2>
          <p className="max-w-[40ch] text-body lg:col-span-5 lg:pb-3 lg:text-lead">
            Describe what you need built: a new product, a feature for the app you have, or a project that&apos;s
            slipping and needs finishing. I&apos;ll reply by email with how I&apos;d build it and when it could go live.
          </p>
        </div>

        <div className="on-paper mt-12 grid overflow-hidden rounded-2xl bg-paper shadow-[0_60px_120px_-50px_rgb(3_20_14/0.85)] md:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
          <div className="p-6 sm:p-9 lg:p-12">

            {isSuccess ? (
              <div role="status" className="flex min-h-[24rem] flex-col justify-center">
                <h3 className="text-q-sm md:text-q">Message sent.</h3>
                <p className="mt-4 max-w-md text-body text-fog">
                  Thanks for writing. I&apos;ll reply to the email address you gave.
                </p>
                <button type="button" onClick={() => reset()} className="link-underline mt-8 w-fit text-ui font-bold">
                  Send another message
                </button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit((values) => send(values))} className="space-y-5" noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
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
                        <FormLabel className={labelClass}>What are we building?</FormLabel>
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
                    className="inline-flex h-14 w-full items-center justify-center rounded-md bg-pine px-9 text-ui font-bold text-paper shadow-[0_3px_0_#041f15] transition-[translate,box-shadow,opacity] duration-100 active:translate-y-0.5 active:shadow-[0_1px_0_#041f15] disabled:opacity-60 sm:w-auto"
                  >
                    {isPending ? "Sending…" : "Send message"}
                  </button>
                </form>
              </Form>
            )}
          </div>

          <div className="flex flex-col border-t bg-umbra p-6 sm:p-9 lg:border-l lg:border-t-0 lg:p-10">
            <p className="text-fine font-bold">Or reach me directly</p>
            <ul className="mt-4">
              {CHANNELS.map(({ label, value, href, Icon }) => (
                <li key={label} className="border-t first:border-t-0">
                  <a
                    href={href}
                    {...(href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                    className="group/channel flex items-center gap-4 py-4"
                  >
                    <Icon aria-hidden className="size-5 shrink-0 text-emerald" />
                    <span className="min-w-0">
                      <span className="block text-fine text-fog">{label}</span>
                      <span className="link-underline block truncate text-ui font-bold decoration-transparent">{value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-8 text-fine text-fog">Islamabad, UTC+5. Working worldwide.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
