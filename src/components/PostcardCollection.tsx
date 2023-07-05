import clsx from "clsx";
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
        <div className="mb-2 text-xl font-bold">{title}</div>
        <p className="truncate text-base text-gray-700">{description}</p>
      </div>
    </div>
  );
};

interface Collection {
  title: string;
  description: string;
  coverImage: string;
}

export const SamplePostcardCollection: React.FC = () => {
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

  return (
    <div className="bg-yellow/20 p-8">
      <h2 className="text-lg font-semibold text-indigo-600">Collections</h2>
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

export default PostcardCollection;
