import { Message } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Button from "./Button";
import Img from "./Img";
import PostcardMessageOverlay from "./PostcardMessageOverlay";

const placeholder6x9 =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 6'%3E%3C/svg%3E";

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
}): JSX.Element {
  const { data: session } = useSession();

  const msg =
    props?.messages?.find(
      (el) => el.itemId === props.itemId && el.userId === session?.user?.id
    )?.message || "";
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(msg);

  return (
    <>
      <PostcardMessageOverlay
        itemId={props.itemId}
        open={open}
        setOpen={setOpen}
        message={message}
        setMessage={setMessage}
      />
      <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="aspect-w-9 aspect-h-6 sm:aspect-none relative bg-gray-200 group-hover:opacity-75 sm:h-96">
          {props.optimizeImages ? (
            <Img
              src={props.loadingState ? placeholder6x9 : props.front}
              alt=""
              className="h-full w-full border-b border-gray-100 object-cover object-center sm:h-full sm:w-full"
              width={450}
              height={300}
              text={message}
            />
          ) : (
            <img
              src={props.loadingState ? placeholder6x9 : props.front}
              alt=""
              className="h-full w-full border-b border-gray-100 object-cover object-center sm:h-full sm:w-full"
              width={450}
              height={300}
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
        <div className="aspect-w-9 aspect-h-6 sm:aspect-none relative bg-gray-200 group-hover:opacity-75 sm:h-96">
          {props.optimizeImages ? (
            <Img
              src={props.loadingState ? placeholder6x9 : props.back}
              alt=""
              className="h-full w-full border-b border-gray-100 object-cover object-center sm:h-full sm:w-full"
              width={450}
              height={300}
            />
          ) : (
            <img
              src={props.loadingState ? placeholder6x9 : props.back}
              alt=""
              className="h-full w-full border-b border-gray-100 object-cover object-center sm:h-full sm:w-full"
              width={450}
              height={300}
            />
          )}
          <span className="rounded-full absolute top-2 right-2 inline-flex items-center bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Back
          </span>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-1 flex-col space-y-2 p-4">
            <h3 className="text-sm font-medium text-gray-900">
              <a href={props.stripePaymentLink}>
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
          <div className="z-50 flex h-full place-items-center p-4">
            <Button onClick={() => setOpen(!open)}>
              {message ? "Edit Message" : "Add Message"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
