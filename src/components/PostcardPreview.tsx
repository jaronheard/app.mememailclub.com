import { Message } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Button from "./Button";
import clsx from "clsx";
import Img from "./Img";
import PostcardMessageOverlay from "./PostcardMessageOverlay";

const placeholder6x9 =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 6'%3E%3C/svg%3E";
const placeholder4x6 =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 4'%3E%3C/svg%3E";
const placeholder6x11 =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 11 6'%3E%3C/svg%3E";

export function PostcardPreview(props: {
  itemId: number;
  name: string;
  description: string;
  front: string;
  back: string;
  author: string;
  stripePaymentLink: string;
  optimizeImages?: boolean;
  loadingState?: boolean;
  hideAddressArea?: boolean;
  showAddMessage?: boolean;
  messages?: Message[];
  size?: "4x6" | "6x9" | "6x11";
}): JSX.Element {
  let width = 600;
  let height = 400;
  let aspectRatio = "aspect-[6/4]";
  let placeholderSrc = placeholder4x6;

  if (props.size === "6x9") {
    width = 900;
    height = 600;
    aspectRatio = "aspect-[9/6]";
    placeholderSrc = placeholder6x9;
  } else if (props.size === "6x11") {
    width = 1100;
    height = 600;
    aspectRatio = "aspect-[11/6]";
    placeholderSrc = placeholder6x11;
  }

  const { data: session } = useSession();
  const authed = session?.user?.email;

  const msg =
    props?.messages?.find(
      (el) => el.itemId === props.itemId && el.userId === session?.user?.id
    )?.message || "";
  const msgId = props?.messages?.find(
    (el) => el.itemId === props.itemId && el.userId === session?.user?.id
  )?.id;
  const stripePaymentLinkWithMessage = msgId
    ? `${props.stripePaymentLink}?client_reference_id=${msgId}`
    : props.stripePaymentLink;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(msg);

  return (
    <>
      {authed && (
        <PostcardMessageOverlay
          itemId={props.itemId}
          open={open}
          setOpen={setOpen}
          message={message}
          setMessage={setMessage}
        />
      )}
      <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div
          className={clsx(
            "sm:aspect-none relative bg-gray-200 group-hover:opacity-75",
            aspectRatio
          )}
        >
          {props.optimizeImages ? (
            <Img
              src={props.loadingState ? placeholderSrc : props.front}
              alt=""
              className="h-full w-full border-b border-gray-100 object-cover object-center sm:h-full sm:w-full"
              width={width}
              height={height}
              text={(authed && message) || ""}
            />
          ) : (
            <img
              src={props.loadingState ? placeholderSrc : props.front}
              alt=""
              className="h-full w-full border-b border-gray-100 object-cover object-center sm:h-full sm:w-full"
              width={width}
              height={height}
            />
          )}
          <span className="rounded-full absolute top-2 right-2 inline-flex items-center bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Front
          </span>
          {!props.hideAddressArea && (
            <div className="absolute right-3 bottom-3 flex h-3/5 w-1/2 place-items-center justify-center rounded-none border-2 border-dashed border-gray-300 bg-white/95 not-italic backdrop-blur-sm">
              <span className="rounded-full inline-flex items-center bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                Address & Postage Area
              </span>
            </div>
          )}
        </div>
        <div
          className={clsx(
            "sm:aspect-none relative bg-gray-200 group-hover:opacity-75",
            aspectRatio
          )}
        >
          {props.optimizeImages ? (
            <Img
              src={props.loadingState ? placeholderSrc : props.back}
              alt=""
              className="h-full w-full border-b border-gray-100 object-cover object-center sm:h-full sm:w-full"
              width={width}
              height={height}
            />
          ) : (
            <img
              src={props.loadingState ? placeholderSrc : props.back}
              alt=""
              className="h-full w-full border-b border-gray-100 object-cover object-center sm:h-full sm:w-full"
              width={width}
              height={height}
            />
          )}
          <span className="rounded-full absolute top-2 right-2 inline-flex items-center bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Back
          </span>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-1 flex-col space-y-2 p-4">
            <h3 className="text-sm font-medium text-gray-900">
              <a href={stripePaymentLinkWithMessage}>
                <span aria-hidden="true" className="absolute inset-0" />
                {props.name}
              </a>
            </h3>
            <p className="text-sm text-gray-500">{props.description}</p>
            <div className="flex flex-1 flex-col justify-end">
              <p className="text-sm italic text-gray-500">{props.author}</p>
              <p className="text-base font-medium text-gray-900">$1</p>
            </div>
          </div>
          {authed && (
            <div className="z-50 flex h-full place-items-center p-4">
              <Button onClick={() => setOpen(!open)}>
                {message ? "Edit Message" : "Add Message"}
              </Button>
            </div>
          )}
          {!authed && (
            <div className="z-50 flex h-full place-items-center p-4">
              <Button href="/login?next=/explore">Add Message</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
