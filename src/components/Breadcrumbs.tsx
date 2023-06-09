import { ChevronRightIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

type BreadcrumbsProps = {
  pages?: {
    name: string;
    href: string;
    current: boolean;
  }[];
  loading?: boolean;
};

const Breadcrumbs = ({ pages, loading }: BreadcrumbsProps) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link
              href="/publications"
              className="text-gray-400 hover:text-gray-500"
            >
              <PencilSquareIcon
                className="h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {/* loading icon */}
        {loading && (
          <li>
            <div className="flex items-center">
              <ChevronRightIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              <span className="ml-4 text-sm font-medium text-gray-500">
                Loading...
              </span>
            </div>
          </li>
        )}
        {!loading &&
          pages &&
          pages.map((page) => (
            <li key={page.name}>
              <div className="flex items-center">
                <ChevronRightIcon
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <Link
                  href={page.href}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                  aria-current={page.current ? "page" : undefined}
                >
                  {page.name}
                </Link>
              </div>
            </li>
          ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
