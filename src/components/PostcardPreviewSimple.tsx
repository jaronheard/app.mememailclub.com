import clsx from "clsx";
import Img from "./Img";
import Button from "./Button";

export function PostcardPreviewSimple(props: {
  id: string;
  front: string;
  name?: string;
  description?: string;
  onClick: () => void;
  loadingState?: boolean;
  hideText?: boolean;
  hideButton?: boolean;
}): JSX.Element {
  const aspectRatio = "aspect-[925/625]";
  const placeholderSrc =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 6'%3E%3C/svg%3E";

  return (
    <div
      id={props.id}
      role="button"
      className="flex flex-col overflow-hidden rounded-lg hover:scale-[1.01] hover:opacity-90"
      onClick={props.onClick}
    >
      <div
        className={clsx(
          "sm:aspect-none relative bg-gray-200",
          aspectRatio,
          props.loadingState && "animate-pulse"
        )}
      >
        <div>
          <Img
            src={props.loadingState ? placeholderSrc : props.front}
            alt=""
            className="h-full w-full object-cover object-center"
            fill
          />
          {!props.hideButton && (
            <Button
              visualOnly
              size="sm"
              variant="primary"
              className="absolute right-2 bottom-2"
            >
              Add message
            </Button>
          )}
        </div>
      </div>
      {!props.hideText && props.name && (
        <>
          <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
            <h3>{props.name || "Untitled"}</h3>
          </div>
          <p className="mt-1 text-left text-sm italic text-gray-400">{`6"x9" postcard w/ message and postage`}</p>
        </>
      )}
    </div>
  );
}
