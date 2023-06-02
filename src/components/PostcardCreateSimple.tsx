import clsx from "clsx";
import Img from "./Img";

export function PostcardCreateSimple(props: {
  onClick: () => void;
}): JSX.Element {
  const aspectRatio = "aspect-[925/625]";
  const placeholderSrc =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 6'%3E%3C/svg%3E";

  return (
    <div
      role="button"
      className="group flex flex-col overflow-hidden rounded-lg"
      onClick={props.onClick}
    >
      <div
        className={clsx(
          "sm:aspect-none relative bg-gray-200 group-hover:opacity-75",
          aspectRatio
        )}
      >
        <div>
          <Img
            src={placeholderSrc}
            alt=""
            className="h-full w-full object-cover object-center"
            fill
          />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
        <h3>Create your own</h3>
        <p>$1</p>
      </div>
      <p className="mt-1 text-sm italic text-gray-400">{`6"x9" postcard w/ message and postage`}</p>
    </div>
  );
}
