import Img from "../components/Img";

export function PostcardPreview(props: {
  id: number;
  name: string;
  description: string;
  front: string;
  back: string;
  author: string;
  stripePaymentLink: string;
}): JSX.Element {
  return (
    <div
      key={props.id}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
    >
      <div className="aspect-w-9 aspect-h-6 sm:aspect-none bg-gray-200 group-hover:opacity-75 sm:h-96">
        <Img
          src={props.front}
          alt=""
          className="h-full w-full border-b border-gray-100 object-cover object-center sm:h-full sm:w-full"
          width={450}
          height={300}
        />
      </div>
      <div className="aspect-w-9 aspect-h-6 sm:aspect-none bg-gray-200 group-hover:opacity-75 sm:h-96">
        <Img
          src={props.back}
          alt=""
          className="h-full w-full border-b border-gray-100 object-cover object-center sm:h-full sm:w-full"
          width={450}
          height={300}
        />
      </div>
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
          <p className="text-base font-medium text-gray-900">$2</p>
        </div>
      </div>
    </div>
  );
}
