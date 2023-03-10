import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PencilIcon } from "@heroicons/react/24/outline";
import Button from "./Button";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

export type PostcardMessageOverlayFormValues = {
  msg: string;
};

export default function PostcardMessageOverlay(props: {
  itemId: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  message: string;
  setMessage: (message: string) => void;
  msgId?: number;
}): JSX.Element {
  const { open, setOpen, message, setMessage, msgId } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostcardMessageOverlayFormValues>({
    defaultValues: {
      msg: message,
    },
  });

  const { data: session } = useSession();
  const utils = trpc.useContext();
  const createMessage = trpc.useMutation("messages.createMessage", {
    onSuccess() {
      // TODO: invalidate queries
      utils.invalidateQueries("items.getAll");
    },
  });
  const updateMessage = trpc.useMutation("messages.updateMessage", {
    onSuccess() {
      // TODO: invalidate queries
      utils.invalidateQueries("items.getAll");
    },
  });

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="rounded-full mx-auto flex h-12 w-12 items-center justify-center">
                    <PencilIcon
                      className="h-6 w-6 text-indigo-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Add a message
                    </Dialog.Title>
                    <div className="mt-2">
                      <textarea
                        {...register("msg", { required: false })}
                        autoComplete="off"
                        rows={6}
                        className={clsx(
                          "block w-full rounded-md border p-3 shadow-sm placeholder:text-gray-300  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                          {
                            "border-red-300": errors.msg,
                            "border-gray-300": !errors.msg,
                          }
                        )}
                        placeholder="Stuck on what to write? Tell them where you are, what you’re doing, and how you feel. Make it personal!"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex justify-center">
                  <Button
                    onClick={handleSubmit((data) => {
                      session?.user &&
                        !msgId &&
                        createMessage.mutate({
                          message: data.msg,
                          itemId: props.itemId,
                          userId: session.user.id,
                        });
                      session?.user &&
                        msgId &&
                        updateMessage.mutate({
                          id: msgId,
                          message: data.msg,
                        });
                      setMessage(data.msg);
                      setOpen(false);
                    })}
                  >
                    Update
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
