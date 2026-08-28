import type { ReactElement } from "react";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "smtp.postmarkapp.com",
  port: 587,
  auth: {
    user: process.env.POSTMARK_API_KEY,
    pass: process.env.POSTMARK_API_KEY,
  },
});

const defaultFrom = "Jaron from PostPostcard <hi@postpostcard.com>";

export type SendMailOptions = {
  component: ReactElement;
  to: string | string[];
  subject?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
};

/**
 * Templates can declare a default subject as a static property, e.g.
 * `PostcardSent.subject = "💌 Your postcard has been sent!"`. When
 * sendMail is called without a subject, that template default is used.
 */
const getComponentSubject = (component: ReactElement): string | undefined => {
  const type: unknown = component.type;
  if (
    typeof type === "function" &&
    "subject" in type &&
    typeof (type as { subject?: unknown }).subject === "string"
  ) {
    return (type as { subject: string }).subject;
  }
  return undefined;
};

const sendMail = async ({
  component,
  to,
  subject,
  from = defaultFrom,
  cc,
  bcc,
  replyTo,
}: SendMailOptions) => {
  const html = await render(component);
  const text = await render(component, { plainText: true });
  return transport.sendMail({
    from,
    to,
    cc,
    bcc,
    replyTo,
    subject: subject ?? getComponentSubject(component) ?? "PostPostcard",
    html,
    text,
  });
};

export default sendMail;
