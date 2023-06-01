import clsx from "clsx";
import Img from "./Img";

const placeholder6x9 =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 6'%3E%3C/svg%3E";
const placeholder4x6 =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 4'%3E%3C/svg%3E";
const placeholder6x11 =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 11 6'%3E%3C/svg%3E";

const sampleMessage = `Greetings from Valencia!

We wanted to send you a little note from our travels to let you know that we're having an amazing time exploring this beautiful place. The breathtaking scenery, vibrant culture, and warm hospitality have truly captured our hearts.

Every day brings new adventures as we wander through winding streets, visit historic landmarks, and indulge in delicious local cuisine. The sights and sounds are simply mesmerizing, and we wish you could be here to experience it all with us.

The people we've met along the way have been incredibly friendly and welcoming. Their stories and traditions have given us a deeper understanding of the rich heritage of this region. We've made lasting memories and forged connections that will stay with us forever.

From stunning sunsets to hidden gems off the beaten path, Valencia has something for everyone. Whether you're a nature enthusiast, a history buff, or simply seeking relaxation, you'll find it all here. The vibrant energy of this place is contagious, and we can't help but be swept away by its charm.

As we continue our journey, we'll be sure to keep you in our thoughts and share more of our experiences with you. Until then, we hope you're enjoying your own adventures and that our paths will cross again soon.

Writing postcards on the computer is a little unhinged, and using ChatGPT sample text is even more unhinged.

Sending you unhinged and warm wishes from afar,

The Smith Family`;

export function PostcardBackWithOverlay(props: {
  back: string;
  optimizeImages?: boolean;
  loadingState?: boolean;
  size?: "4x6" | "6x9" | "6x11";
}): JSX.Element {
  let width = 600;
  let height = 400;
  let addressWidth = "w-[50%]"; // 300
  let addressHeight = "h-[60%]"; // 160
  let aspectRatio = "aspect-[6/4]";
  let placeholderSrc = placeholder4x6;

  if (props.size === "6x9") {
    width = 925;
    height = 625;
    addressWidth = "w-[43.10%]"; // 4" / 9.25" = 0.431
    addressHeight = "h-[37.5%]"; // 2.375" / 6.25" = 0.375
    aspectRatio = "aspect-[925/625]";
    placeholderSrc = placeholder6x9;
  } else if (props.size === "6x11") {
    width = 1100;
    height = 600;
    addressWidth = "w-[27.27%]"; // 300
    addressHeight = "h-[26.66%]"; // 160
    aspectRatio = "aspect-[11/6]";
    placeholderSrc = placeholder6x11;
  }

  return (
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
          text={sampleMessage}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={props.loadingState ? placeholderSrc : props.back}
          alt=""
          className="h-full w-full border-b border-gray-100 object-cover object-center sm:h-full sm:w-full"
          width={width}
          height={height}
        />
      )}
      <div
        className={clsx(
          "absolute right-3 bottom-3 flex place-items-center justify-center rounded-none border-2 border-dashed border-gray-300 bg-white/95 not-italic backdrop-blur-sm",
          addressHeight,
          addressWidth
        )}
      >
        <span className="rounded-full inline-flex items-center bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
          Address & Postage Area
        </span>
      </div>
    </div>
  );
}
