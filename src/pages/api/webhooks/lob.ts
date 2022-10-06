/* eslint-disable @typescript-eslint/ban-ts-comment */
import Cors from "micro-cors";
import { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "../../../server/router";
import { prisma } from "../../../server/db/client";
import { RequestHandler } from "next/dist/server/next";

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const caller = appRouter.createCaller({ session: null, prisma: prisma });

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    console.log("Lob webhook received, but not yet implemented");
    console.log(req.body);
    res.json({ received: true });
    console.log("Acknowledged webhook recieved");
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default cors(webhookHandler as RequestHandler);
