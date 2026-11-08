"use client";

import { SITE } from "@/constants/site";
import { FormValidator, FormValues } from "@/lib/validators/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const fieldClass =
  "h-12 rounded-xl border-input bg-card px-4 text-[16px] focus-visible:ring-offset-0";

const Contact = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormValidator),
    mode: "onBlur",
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const {
    mutate: send,
    isPending,
    isSuccess,
    isError,
    reset,
  } = useMutation({
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
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28"
    >
      <div className="grid gap-12 rounded-[28px] bg-foreground px-6 py-12 text-background md:grid-cols-12 md:gap-8 md:px-12 md:py-16">
        <div className="md:col-span-5">
          <h2
            id="contact-title"
            className="text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] md:text-[56px]"
          >
            Tell me what you&apos;re building.
          </h2>
          <p className="mt-5 max-w-sm text-[17px] leading-relaxed text-background/70">
            New product, an AI feature for an existing app, or a voice agent.
            Send a few lines and I&apos;ll reply by email.
          </p>
          <dl className="mt-10 space-y-5 text-[17px]">
            <div>
              <dt className="text-[15px] text-background/60">Email</dt>
              <dd>
                <a
                  href={`mailto:${SITE.email}`}
                  className="underline decoration-background/30 underline-offset-[5px] transition-colors hover:decoration-background"
                >
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[15px] text-background/60">WhatsApp</dt>
              <dd>
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-background/30 underline-offset-[5px] transition-colors hover:decoration-background"
                >
                  {SITE.phone}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-[20px] bg-background p-6 text-foreground md:col-span-7 md:p-8">
          {isSuccess ? (
            <div role="status" className="flex h-full flex-col justify-center py-10">
              <h3 className="text-[28px] font-semibold tracking-tight">
                Message sent
              </h3>
              <p className="mt-3 max-w-md text-muted-foreground">
                Thanks for reaching out. I&apos;ll reply to the email address
                you gave.
              </p>
              <button
                type="button"
                onClick={() => reset()}
                className="link-underline mt-6 w-fit font-medium"
              >
                Send another message
              </button>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((values) => send(values))}
                className="space-y-5"
                noValidate
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[15px]">Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            autoComplete="name"
                            className={fieldClass}
                          />
                        </FormControl>
                        <FormMessage className="text-[13px] text-destructive" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[15px]">Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            inputMode="email"
                            disabled={isPending}
                            autoComplete="email"
                            spellCheck={false}
                            className={fieldClass}
                          />
                        </FormControl>
                        <FormMessage className="text-[13px] text-destructive" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[15px]">
                        Phone or WhatsApp{" "}
                        <span className="font-normal text-muted-foreground">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          inputMode="tel"
                          disabled={isPending}
                          autoComplete="tel"
                          className={fieldClass}
                        />
                      </FormControl>
                      <FormMessage className="text-[13px] text-destructive" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[15px]">
                        About your project
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={5}
                          disabled={isPending}
                          placeholder="What are you building, and where could I help?"
                          className="resize-none rounded-xl border-input bg-card px-4 py-3 text-[16px] focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage className="text-[13px] text-destructive" />
                    </FormItem>
                  )}
                />

                {isError && (
                  <p role="alert" className="text-[15px] text-destructive">
                    Your message couldn&apos;t be sent. Try again, or email me
                    at {SITE.email}.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-7 text-[16px] font-medium text-primary-foreground transition-colors hover:bg-foreground disabled:opacity-60 sm:w-auto"
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
