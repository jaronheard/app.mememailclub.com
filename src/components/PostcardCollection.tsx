import clsx from "clsx";
import Image from "next/image";
import React from "react";
import { trpc } from "../utils/trpc";
import DefaultQueryCell from "./DefaultQueryCell";
import Link from "next/link";

const placeholder6x9 =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 6'%3E%3C/svg%3E";

interface PostcardCollectionsProps {
  id?: number;
  title?: string;
  description?: string;
  images?: readonly string[];
  className?: string;
  loading?: boolean;
}

const PostcardCollections: React.FC<PostcardCollectionsProps> = ({
  id,
  title,
  description,
  images,
  className,
  loading,
}) => {
  const imagesOrPlaceholders = images ?? [placeholder6x9, placeholder6x9];

  return (
    <Link
      href={`/publications/${id}`}
      className={clsx(
        "flex flex-col items-center justify-center bg-indigo-700 p-4",
        className
      )}
    >
      <h1 className="mb-2 text-2xl font-bold text-white">
        {loading ? "Loading..." : title}
      </h1>
      <p className="mb-4 text-white">{loading ? "" : description}</p>
      <div className="grid grid-cols-3 gap-4">
        {imagesOrPlaceholders.map((image, index) => (
          <div
            key={index}
            className={clsx(
              "transform",
              index % 2 === 0 ? "rotate-3" : "-rotate-3",
              // index % 2 === 0 ? "-translate-x-2/3" : "translate-x-2/3",
              "overflow-hidden rounded-lg shadow sm:translate-x-0"
            )}
          >
            <Image
              src={loading ? placeholder6x9 : image}
              alt={`Postcard ${index + 1}`}
              width={450}
              height={300}
            />
          </div>
        ))}
      </div>
    </Link>
  );
};

export const SamplePostcardCollections: React.FC = () => {
  const featuredPublicationsQuery = trpc.useQuery(["publications.getFeatured"]);

  return (
    <div className="bg-indigo-700/10 p-4 sm:p-8 lg:col-span-2">
      <h2 className="mb-2 text-lg font-semibold text-indigo-700 sm:mb-8">
        Featured Collections
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:gap-8 md:grid-cols-2">
        <DefaultQueryCell
          query={featuredPublicationsQuery}
          success={({ data: publications }) => {
            const [firstFeaturedPublication, secondFeaturedPublication] =
              publications;
            if (!firstFeaturedPublication || !secondFeaturedPublication) {
              return null;
            }

            // array of front property of first three publications.Items with null checks
            const firstFeaturedPublicationImages = ["", "", ""].map(
              (item, idx) => {
                if (
                  typeof secondFeaturedPublication?.Items[idx]?.front ===
                  "string"
                ) {
                  return firstFeaturedPublication?.Items[idx]?.front as string;
                } else {
                  return "";
                }
              }
            );
            const secondFeaturedPublicationImages = ["", "", ""].map(
              (item, idx) => {
                if (
                  typeof secondFeaturedPublication?.Items[idx]?.front ===
                  "string"
                ) {
                  return secondFeaturedPublication?.Items[idx]?.front as string;
                } else {
                  return "";
                }
              }
            );

            // check for null values in array
            const firstFeaturedPublicationImagesNullCheck =
              firstFeaturedPublicationImages.every((image) => image.length > 0);
            const secondFeaturedPublicationImagesNullCheck =
              secondFeaturedPublicationImages.every(
                (image) => image.length > 0
              );

            if (
              !firstFeaturedPublicationImagesNullCheck ||
              !secondFeaturedPublicationImagesNullCheck
            ) {
              return null;
            }

            return (
              <>
                <PostcardCollections
                  id={firstFeaturedPublication.id}
                  title={firstFeaturedPublication.name}
                  description={firstFeaturedPublication.description}
                  images={firstFeaturedPublicationImages}
                />
                <PostcardCollections
                  id={secondFeaturedPublication.id}
                  title={secondFeaturedPublication.name}
                  description={secondFeaturedPublication.description}
                  images={secondFeaturedPublicationImages}
                  // className="hidden sm:block"
                />
              </>
            );
          }}
          loading={() => (
            <>
              <PostcardCollections loading />
              <PostcardCollections loading />
            </>
          )}
        />
      </div>
      {/* Other content */}
    </div>
  );
};

export default SamplePostcardCollections;
