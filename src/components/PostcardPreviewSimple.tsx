import clsx from "clsx";
import Img from "./Img";

export function PostcardPreviewSimple(props: {
  front: string;
  stripePaymentLink: string;
  loadingState?: boolean;
}): JSX.Element {
  const aspectRatio = "aspect-[925/625]";
  const placeholderSrc =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 6'%3E%3C/svg%3E";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <a
        href={props.stripePaymentLink}
        className={clsx(
          "sm:aspect-none relative bg-gray-200 group-hover:opacity-75",
          aspectRatio
        )}
      >
        <Img
          src={props.loadingState ? placeholderSrc : props.front}
          alt=""
          className="h-full w-full object-cover object-center sm:h-full sm:w-full"
          fill
        />
        <span className="rounded-full absolute top-2 right-2 inline-flex items-center bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
          Front
        </span>
      </a>
    </div>
  );
}
