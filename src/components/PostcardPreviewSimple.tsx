import clsx from "clsx";
import Img from "./Img";

export function PostcardPreviewSimple(props: {
  front: string;
  name: string;
  description: string;
  stripePaymentLink: string;
  loadingState?: boolean;
}): JSX.Element {
  const aspectRatio = "aspect-[925/625]";
  const placeholderSrc =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 6'%3E%3C/svg%3E";

  return (
    <a
      className="group flex flex-col overflow-hidden rounded-lg"
      href={props.stripePaymentLink}
    >
      <div
        className={clsx(
          "sm:aspect-none relative bg-gray-200 group-hover:opacity-75",
          aspectRatio
        )}
      >
        <div>
          <Img
            src={props.loadingState ? placeholderSrc : props.front}
            alt=""
            className="h-full w-full object-cover object-center"
            fill
          />
          <span className="rounded-full absolute top-2 right-2 inline-flex items-center bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Front
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
        <h3>{props.name}</h3>
        <p>$1</p>
      </div>
      <p className="mt-1 text-sm italic text-gray-400">{`6"x9" postcard w/ message and postage`}</p>
    </a>
  );
}
