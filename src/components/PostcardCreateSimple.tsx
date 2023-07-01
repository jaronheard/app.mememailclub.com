import clsx from "clsx";
import Img from "./Img";

export function PostcardCreateSimple(props: {
  onClick: () => void;
}): JSX.Element {
  const aspectRatio = "aspect-[925/625]";
  const placeholderSrc =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='600' fill='none'%3E%3Cg clip-path='url(%23a)'%3E%3Cpath fill='%23DA2727' d='M0 0h900v600H0z'/%3E%3Cpath fill='%235520F8' d='M450 0h450v300H450z'/%3E%3Cpath fill='%23FE0760' fill-opacity='.376' d='M450 300h450v300H450z'/%3E%3Cpath fill='%232385F8' d='M0 0h450v300H0z'/%3E%3Cpath fill='%23FC5825' d='M0 300h450v300H0z'/%3E%3Ccircle cx='455.5' cy='301.5' r='66.5' fill='%23000'/%3E%3Ccircle cx='450' cy='300' r='132' stroke='%23000' stroke-dasharray='20 20' stroke-width='16'/%3E%3Cpath fill='%23FFFAF5' fill-rule='evenodd' d='M449.514 177.24c-68.987 0-124.906 55.173-124.906 123.24 0 68.066 55.919 123.24 124.906 123.24 68.986 0 124.905-55.174 124.905-123.24 0-68.067-55.919-123.24-124.905-123.24Zm9.608 85.32a9.42 9.42 0 0 0-2.814-6.704 9.678 9.678 0 0 0-6.794-2.776 9.675 9.675 0 0 0-6.794 2.776 9.417 9.417 0 0 0-2.815 6.704V291h-28.824a9.678 9.678 0 0 0-6.794 2.776 9.416 9.416 0 0 0-2.814 6.704 9.416 9.416 0 0 0 2.814 6.703 9.675 9.675 0 0 0 6.794 2.777h28.824v28.44a9.417 9.417 0 0 0 2.815 6.703 9.671 9.671 0 0 0 6.794 2.777 9.675 9.675 0 0 0 6.794-2.777 9.42 9.42 0 0 0 2.814-6.703v-28.44h28.824a9.675 9.675 0 0 0 6.794-2.777 9.416 9.416 0 0 0 2.814-6.703 9.416 9.416 0 0 0-2.814-6.704 9.678 9.678 0 0 0-6.794-2.776h-28.824v-28.44Z' clip-rule='evenodd'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='a'%3E%3Cpath fill='%23fff' d='M0 0h900v600H0z'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E";

  return (
    <div
      role="button"
      className="flex flex-col overflow-hidden rounded-lg hover:scale-[1.01] hover:opacity-90"
      onClick={props.onClick}
    >
      <div className={clsx("sm:aspect-none relative bg-gray-200", aspectRatio)}>
        <Img
          src={placeholderSrc}
          alt=""
          className="h-full w-full object-cover object-center"
          fill
          sizes="(max-width: 640px) 80vw, 40vw"
        />
      </div>
      <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
        <h3>Create your own</h3>
        <p>$1</p>
      </div>
      <p className="mt-1 text-left text-sm italic text-gray-400">{`6"x9" postcard w/ message and postage`}</p>
    </div>
  );
}
