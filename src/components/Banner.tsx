import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Banner() {
  const [show, setShow] = useState(true);
  const router = useRouter();
  const { query } = router;

  const heading = query?.bannerHeading || "New here? Us too!";
  const text = query?.bannerText || 'Send a huge 6"x9" postcard for just $1!';

  if (!show) return null;
  else
    return (
      <div className="relative bg-indigo-600">
        <div className="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
          <div className="pr-16 sm:px-16 sm:text-center">
            <p className="font-medium text-white">
              <span className="block sm:ml-2 sm:inline-block">
                <span className="font-bold text-white">{heading}&nbsp;</span>
              </span>
              <span className="md:hidden"></span>
              <span className="hidden md:inline">{text}</span>
            </p>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:items-start sm:pt-1 sm:pr-2">
            <button
              type="button"
              className="flex rounded-md p-2 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => {
                setShow(false);
                router.replace(router.pathname, undefined, { shallow: true });
              }}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    );
}
