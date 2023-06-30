import { Fragment, useState } from "react";
import {
  Dialog,
  Disclosure,
  Menu,
  Popover,
  Transition,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { SendParams } from "../pages/send";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";

const sort = [
  { name: "Most Popular", href: "#", key: "most-popular" },
  { name: "Newest", href: "#", key: "newest" },
  { name: "Oldest", href: "#", key: "oldest" },
];

const visibility = {
  id: "visibility",
  name: "Visibility",
  options: [
    { value: "all", label: "All" },
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
  ],
};

const tone = {
  id: "tone",
  name: "Tone",
  options: [
    { value: "all", label: "All" },
    { value: "happiness", label: "Happiness" },
    { value: "love", label: "Love" },
    { value: "sympathy", label: "Sympathy" },
    { value: "gratitude", label: "Gratitude" },
    { value: "excitement", label: "Excitement" },
    { value: "calmness", label: "Calmness" },
    { value: "nostalgia", label: "Nostalgia" },
  ],
};

const occasion = {
  id: "occasion",
  name: "Occasion",
  options: [
    { value: "all", label: "All" },
    { value: "birthdays", label: "Birthdays" },
    { value: "weddings", label: "Weddings" },
    { value: "anniversaries", label: "Anniversaries" },
    { value: "holidays", label: "Holidays" },
    { value: "graduations", label: "Graduations" },
    { value: "congratulations", label: "Congratulations" },
    { value: "condolences", label: "Condolences" },
  ],
};

const filters = [visibility, tone, occasion];

const filterOptionsSchema = z.array(
  z.object({
    value: z.string(),
    label: z.string(),
  })
);

const filtersSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    options: filterOptionsSchema,
  })
);

type FilterOption = z.TypeOf<typeof filterOptionsSchema>;

type CategoryFilterProps = {
  params: SendParams;
  children?: React.ReactNode;
};

export default function CategoryFilter(props: CategoryFilterProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<SendParams>({
    defaultValues: {
      ...props.params,
    },
  });
  
  return (
    <div className="">
      {/* Mobile filter dialog */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 sm:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="hover: -mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filters */}
                <form className="mt-4">
                  {filters.map((section) => (
                    <Disclosure
                      as="div"
                      key={section.name}
                      className="border-t border-gray-200 px-4 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                              <span className="font-medium text-gray-900">
                                {section.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                <ChevronDownIcon
                                  className={clsx(
                                    open ? "-rotate-180" : "rotate-0",
                                    "h-5 w-5 transform"
                                  )}
                                  aria-hidden="true"
                                />
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {section.options.map((option, optionIdx) => (
                                <div
                                  key={option.value}
                                  className="flex items-center"
                                >
                                  <input
                                    id={`filter-mobile-${section.id}-${optionIdx}`}
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    {...register(
                                      `${section.id}-${option.value}` as any,
                                      {
                                        onChange: () => {
                                          handleSubmit(
                                            (data) => {
                                              router.push({
                                                query: {
                                                  ...router.query,
                                                  ...data,
                                                },
                                              });
                                            },
                                            (errors) => {
                                              console.log(errors);
                                            }
                                          );
                                        },
                                      }
                                    )}
                                  />
                                  <label
                                    htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                    className="ml-3 text-sm text-gray-500"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="py-24">
          <h2 className="text-lg font-semibold text-indigo-600">Postcards</h2>
          <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Send love by mail
          </p>
          <p className="mx-auto mt-5 max-w-xl text-xl text-gray-500">
            A 6&quot;x9&quot; postcard with your message delivered for{" "}
            <span className="font-semibold text-indigo-600">$1</span>*
          </p>
          <p className="mx-auto max-w-xl text-xs text-gray-500">
            <em>*U.S. addresses only</em>
          </p>
        </div>

        <section
          aria-labelledby="filter-heading"
          className="border-t border-gray-200 py-6"
        >
          <h2 id="filter-heading" className="sr-only">
            Product filters
          </h2>

          <div className="flex items-center justify-between">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sort
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sort.map((option) => (
                      <Menu.Item key={option.name}>
                        {({ active }) => (
                          <Link
                            href={{
                              query: { ...router.query, sort: option.key },
                            }}
                            className={clsx(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm font-medium text-gray-900"
                            )}
                          >
                            {option.name}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <button
              type="button"
              className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
              onClick={() => setOpen(true)}
            >
              Filters
            </button>

            <Popover.Group className="hidden sm:flex sm:items-baseline sm:space-x-8">
              {filters.map((section, sectionIdx) => (
                <Popover
                  as="div"
                  key={section.name}
                  id={`desktop-menu-${sectionIdx}`}
                  className="relative inline-block text-left"
                >
                  <div>
                    <Popover.Button className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                      <span>{section.name}</span>
                      {sectionIdx === 0 ? (
                        <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                          1
                        </span>
                      ) : null}
                      <ChevronDownIcon
                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </Popover.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <form className="space-y-4">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              id={`filter-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              defaultValue={option.value}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={`filter-${section.id}-${optionIdx}`}
                              className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </form>
                    </Popover.Panel>
                  </Transition>
                </Popover>
              ))}
            </Popover.Group>
          </div>
        </section>
        {props.children}
      </div>
    </div>
  );
}
