import clsx from "clsx";
import { de } from "date-fns/locale";
import React from "react";

interface PostcardCollectionProps {
  title: string;
  description: string;
  coverImage: string;
  className?: string;
}

const PostcardCollection: React.FC<PostcardCollectionProps> = ({
  title,
  description,
  coverImage,
  className,
}) => {
  return (
    <div
      className={clsx(
        "max-w-sm overflow-hidden rounded bg-white shadow",
        className
      )}
    >
      <img
        className="w-full"
        src={coverImage}
        alt="Postcard Collection Cover"
      />
      <div className="px-6 py-4">
        <div className="mb-2 truncate text-xl font-bold">{title}</div>
        <p className="sm truncate text-base text-gray-700">{description}</p>
      </div>
    </div>
  );
};

interface Collection {
  title: string;
  description: string;
  coverImage: string;
}

const collections: Collection[] = [
  {
    title: "Email Memes",
    description:
      "Is sending a postcard as good as writing an email? Maybe not, but we have jokes about it.",
    coverImage:
      "https://res.cloudinary.com/jaronheard/image/upload/q_auto,f_auto/w_1200/mail/Back_f6rjvm",
  },
  {
    title: "Roadside America",
    description:
      "The architectural commentator and photographer John Margolies (1940-2016) recognized the potential for beauty in the structures and signage along American roadsides.",
    coverImage:
      "https://res.cloudinary.com/jaronheard/image/upload/q_auto,f_auto/w_1200/mail/master-pnp-mrg-06300-06367u_vrmhte",
  },
  {
    title: "Munsell Color System",
    description:
      "Prior to releasing his Atlas in 1915, artist and art instructor Albert Henry Munsell (1858-1918) devoted numerous years striving to condense the entirety of human color perception into a streamlined and sophisticated three-dimensional visual representation.",
    coverImage:
      "https://res.cloudinary.com/jaronheard/image/upload/q_auto,f_auto/w_1200/mail/AtlasMunsellcol00Muns_0029_tmzb2h",
  },
  // Add more collections as needed
];

const sampleCollections = [
  {
    title: "Roadside America",
    description:
      "The architectural commentator and photographer John Margolies (1940-2016) recognized the potential for beauty in the structures and signage along American roadsides.",
    images: [
      "https://res.cloudinary.com/jaronheard/image/upload/q_auto,f_auto/w_1200/mail/master-pnp-mrg-00000-00081u_vfxlzp",
      "https://res.cloudinary.com/jaronheard/image/upload/q_auto,f_auto/w_1200/mail/master-pnp-mrg-06800-06848u_ptdsbp",
      "https://res.cloudinary.com/jaronheard/image/upload/q_auto,f_auto/w_1200/mail/master-pnp-mrg-06300-06367u_vrmhte",
    ],
  },
  {
    title: "Munsell Color System",
    description:
      "Artist and art instructor Albert Henry Munsell (1858-1918) condensed human color perception into a streamlined and sophisticated three-dimensional visual representation.",
    images: [
      "https://res.cloudinary.com/jaronheard/image/upload/q_auto,f_auto/w_1200/mail/AtlasMunsellcol00Muns_0029_tmzb2h",
      "https://res.cloudinary.com/jaronheard/image/upload/q_auto,f_auto/w_1200/mail/AtlasMunsellcol00Muns_0033_ksagls",
      "https://res.cloudinary.com/jaronheard/image/upload/q_auto,f_auto/w_1200/mail/AtlasMunsellcol00Muns_0013_yfd7yh",
    ],
  },
  {
    title: "Email Memes",
    description:
      "Is sending a postcard as good as writing an email? Maybe not, but we have jokes about it.",
    images: [
      "https://res.cloudinary.com/jaronheard/image/upload/q_auto,f_auto/w_1200/mail/master-pnp-mrg-00000-00081u_vfxlzp",
      "https://res.cloudinary.com/jaronheard/image/upload/q_auto,f_auto/w_1200/mail/master-pnp-mrg-06800-06848u_ptdsbp",
      "https://res.cloudinary.com/jaronheard/image/upload/q_auto,f_auto/w_1200/mail/master-pnp-mrg-06300-06367u_vrmhte",
    ],
  },
  // Add more collections as needed
] as const;

export const SamplePostcardCollection: React.FC = () => {
  return (
    <div className="bg-yellow/20 p-4 sm:p-8 lg:col-span-2">
      <h2 className="text-lg font-semibold text-indigo-600">
        Featured Collections
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {collections.map((collection, index) => (
          <PostcardCollection
            key={index}
            className={index > 1 ? "hidden sm:block" : ""}
            title={collection.title}
            description={collection.description}
            coverImage={collection.coverImage}
          />
        ))}
      </div>
    </div>
  );
};

interface PostcardCollectionsProps {
  title: string;
  description: string;
  images: readonly string[];
  className?: string;
}

const PostcardCollections: React.FC<PostcardCollectionsProps> = ({
  title,
  description,
  images,
  className,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center bg-indigo-700 p-4",
        className
      )}
    >
      <h1 className="mb-2 text-2xl font-bold text-white">{title}</h1>
      <p className="mb-4 text-white">{description}</p>
      <div className="grid grid-cols-1 grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className={clsx(
              "transform",
              index % 2 === 0 ? "rotate-3" : "-rotate-3",
              // index % 2 === 0 ? "-translate-x-2/3" : "translate-x-2/3",
              "overflow-hidden rounded-lg shadow sm:translate-x-0"
            )}
          >
            <img
              src={image}
              alt={`Postcard ${index + 1}`}
              className="h-auto w-full"
            />
          </div>
        ))}{" "}
      </div>
    </div>
  );
};

export const SamplePostcardCollections: React.FC = () => {
  const one = sampleCollections[0];
  const two = sampleCollections[1];

  return (
    <div className="bg-indigo-700/10 p-4 sm:p-8 lg:col-span-2">
      <h2 className="mb-2 text-lg font-semibold text-indigo-700gc sm:mb-8">
        Featured Collections
      </h2>
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
        <PostcardCollections
          title={one.title}
          description={one.description}
          images={one.images}
        />
        <PostcardCollections
          title={two.title}
          description={two.description}
          images={two.images}
          // className="hidden sm:block"
        />
      </div>
      {/* Other content */}
    </div>
  );
};

export default PostcardCollection;
