"use client";

import { SITE } from "@/constants/site";
import { CONTACT_TOPIC_EVENT, CONTACT_TOPIC_KEY } from "@/lib/contact-topic";
import type { FormValues } from "@/lib/validators/form";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import Rise from "../motion/rise";
import { Textarea } from "../ui/textarea";

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
    const prefill = (topic: string | null) => {
      if (topic && !form.getValues("message")) {
        form.setValue("message", `I'd like to talk about ${topic.replace(/[.\s]+$/, "")}.`);
      }
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
    <section id="contact" aria-labelledby="contact-title" className="on-ember overflow-hidden">
      <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] pt-24 md:pt-36">
        <Rise
          as="h2"
          by="lines"
          id="contact-title"
          className="font-display text-[length:36.5vw] leading-[0.8] tracking-[-0.02em] min-[1680px]:text-[length:600px]"
        >
          Let&apos;s talk.
        </Rise>
      </div>
      <div className="mx-auto grid max-w-[1680px] gap-16 px-[clamp(20px,4vw,64px)] pb-24 pt-14 md:grid-cols-12 md:gap-x-8 md:pb-36 md:pt-20">
        <div className="md:col-span-5">
          <p className="max-w-[30ch] text-[clamp(24px,2.2vw,34px)] leading-[1.2]">
            A new product, a feature for an app you already have, or a project that&apos;s slipping
            and needs to land. Send a few lines and I&apos;ll reply by email.
          </p>
          <dl className="mt-12 space-y-5">
            <div>
              <dt className="text-ui text-fog">Email</dt>
              <dd className="text-body">
                <a href={`mailto:${SITE.email}`} className="link-underline">
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-ui text-fog">WhatsApp</dt>
              <dd className="text-body">
                <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="link-underline">
                  {SITE.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-ui text-fog">Upwork</dt>
              <dd className="text-body">
                <a href={SITE.upwork} target="_blank" rel="noopener noreferrer" className="link-underline">
                  Hire me on Upwork
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="md:col-span-6 md:col-start-7 md:pt-4">
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
                          placeholder="What are you building, and where could I help?"
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
                  className="inline-flex h-13 w-full items-center justify-center rounded-full bg-caption px-8 text-ui font-bold text-umbra transition-colors hover:bg-signal disabled:opacity-60 sm:w-auto"
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
