import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import Inspiration from "./Inspiration";
import { trackGoal } from "fathom-client";
import Img from "./Img";
import { useUser } from "@clerk/nextjs";
import Button from "./Button";

export type PostcardMessageOverlayFormValues = {
  msg: string;
};

const countLines = (msg: string) => {
  // currently uses 30 characters for max line length
  // split the message based on manual newlines
  const msgSplitByNewlines = msg.split(/\r\n|\r|\n/);
  const msgLinesByLine = msgSplitByNewlines.map((line) => {
    // split each line into chunks of 30 characters
    const chunks = line.match(/.{1,30}/g);
    // count the number of chunks (or 1 if there are no chunks)
    const chunkCount = chunks?.length || 1;
    // return the number of chunks
    return chunkCount;
  });
  // count the number of lines
  const linesCount = msgLinesByLine.reduce((a, b) => a + b, 0);
  return linesCount;
};

const ProgressBar = ({
  progressPercentage,
}: {
  progressPercentage: number;
}) => {
  // limit progress percentage to 100
  progressPercentage = Math.min(progressPercentage, 100);
  // set the progress bar color based on progress percentage thresholds (70%, 80%, 90%, 95%)
  const progressBarColor = clsx({
    "bg-gray-200": progressPercentage < 90,
    "bg-red-200": progressPercentage >= 90 && progressPercentage < 95,
    "bg-red-300": progressPercentage >= 95 && progressPercentage < 100,
    "bg-red-500": progressPercentage >= 100,
  });

  return (
    <div className="h-1 w-full bg-gray-100">
      <div
        style={{ width: `${progressPercentage}%` }}
        className={`h-full ${progressBarColor}`}
      ></div>
    </div>
  );
};

export default function Slideover(props: {
  open: boolean;
  setOpen: (open: boolean) => void;
  itemLink: string;
  itemId: number;
  itemFront: string;
}) {
  const router = useRouter();
  const utils = trpc.useContext();
  const { user } = useUser();
  const { register, watch, handleSubmit, setFocus } =
    useForm<PostcardMessageOverlayFormValues>({
      defaultValues: {
        msg: "",
      },
    });
  // set focus to the message input
  useEffect(() => {
    setFocus("msg");
  }, [setFocus]);

  const linesCount = countLines(watch("msg"));
  const tooManyLines = linesCount > 30;
  const lineTooLong = watch("msg").match(/\S{30,}/g)?.length;
  const hasError = tooManyLines || lineTooLong;

  const { open, setOpen, itemLink, itemId, itemFront } = props;
  const createMessage = trpc.useMutation("messages.createMessage", {
    onSuccess(message) {
      utils.invalidateQueries({ queryKey: "messages" });
      router.push(`${itemLink}?client_reference_id=${message.id}`);
    },
  });

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <div className="flex h-full flex-col divide-y divide-gray-200 bg-postcard shadow-xl">
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="flex items-center gap-3">
                            <Img
                              src={itemFront}
                              alt=""
                              className="w-24 object-cover object-center"
                              width={92.5}
                              height={62.5}
                            />
                            <div>
                              <div className="text-base font-semibold leading-6 text-gray-900">
                                Write postcard
                              </div>
                              <div className="mt-1">
                                <p className="text-sm text-gray-400">
                                  Add your message. Include a greeting and a
                                  signoff.
                                </p>
                              </div>
                            </div>
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-postcard text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <textarea
                            {...register("msg", { required: true })}
                            autoComplete="off"
                            rows={8}
                            className={clsx(
                              "block w-full rounded-md border p-3 shadow-sm placeholder:text-gray-300 sm:text-sm",
                              {
                                "focus:border-red-500 focus:ring-red-500":
                                  hasError,
                                "focus:border-indigo-500 focus:ring-indigo-500":
                                  !hasError,
                              }
                            )}
                            placeholder="Dear recipient..."
                          />
                        </div>
                        <div className="my-2">
                          <ProgressBar
                            progressPercentage={(linesCount / 30) * 100}
                          />
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 justify-between px-4 py-4">
                        <div className="py-2 px-3">
                          {lineTooLong && (
                            <div className="text-sm text-red-500">
                              Some lines are too long
                            </div>
                          )}
                          {tooManyLines && (
                            <div className="text-sm text-red-500">
                              Message is too long
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 px-2">
                          <Button
                            type="button"
                            onClick={() => setOpen(false)}
                            size="sm"
                            variant="secondary"
                          >
                            Cancel
                          </Button>
                          <Button
                            disabled={!!hasError || !watch("msg")}
                            variant="primary"
                            onClick={handleSubmit((data) => {
                              createMessage.mutate({
                                message: data.msg,
                                itemId: itemId,
                                userId: user?.id ? user.id : "unregistered",
                              });
                              trackGoal("GMZEE6ZN", 0);
                            })}
                            type="submit"
                            size="sm"
                          >
                            Address & Send
                          </Button>
                        </div>
                      </div>
                      <div className="relative flex-1 px-4 sm:px-6">
                        <Inspiration />
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
