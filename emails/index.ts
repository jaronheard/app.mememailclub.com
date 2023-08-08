import nodemailer from "nodemailer";
import { buildSendMail } from "mailing-core";

const sendMail = buildSendMail({
  transport: nodemailer.createTransport({
    host: "smtp.postmarkapp.com",
    port: 587,
    auth: {
      user: process.env.POSTMARK_API_KEY,
      pass: process.env.POSTMARK_API_KEY,
    },
  }),
  defaultFrom: "Steven from Dub <steven@dub.sh>",
  configPath: "./mailing.config.json",
  // optional
  // processHtml: (html: string) =>
  //   htmlMinify(html, {
  //     caseSensitive: true,
  //     collapseWhitespace: true,
  //     minifyCSS: true,
  //     removeComments: true,
  //     removeEmptyAttributes: true,
  //   }),
});

export default sendMail;
