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
    console.log("Lob webhook received");
    if (req.body.event_type.id === "postcard.rendered_thumbnails") {
      console.log("Lob webhook processing - req.body", req.body);
      console.log("Postcard rendered thumbnails");
      const { reference_id } = req.body;
      console.log("reference_id", reference_id);
      const item = await caller.mutation(
        "items.updatePostcardPreviewRendered",
        { postcardPreviewId: reference_id, postcardPreviewRendered: true }
      );
      console.log("Updated postcard preview rendered for item", item);
    }
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default cors(webhookHandler as RequestHandler);
