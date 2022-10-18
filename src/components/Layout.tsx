import { Fragment } from "react";
import clsx from "clsx";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Img from "./Img";
import { EnvelopeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    // all properties could be null or undefined
    name?: string | null;
    email?: string | null;
    imageUrl?: string | null;
  };
  title?: string;
}

const Layout = (props: LayoutProps) => {
  const router = useRouter();
  const navigation = [
    {
      name: "Explore",
      href: "/explore",
      Icon: EnvelopeIcon,
      current: ["/explore"].includes(router.asPath),
      title: "Explore postcards",
    },
    {
      name: "Create",
      href: "/publications",
      Icon: PencilSquareIcon,
      current: router.asPath.includes("/publications"),
      title: "Create postcards",
    },
  ];
  const userNavigation = props.user
    ? [
        { name: "Your Profile", href: "#" },
        // { name: "Settings", href: "#" },
        { name: "Sign out", onClick: () => signOut() },
      ]
    : [{ name: "Sign in", href: "/login" }];

  return (
    <>
      <div className="min-h-full bg-gradient-to-r from-indigo-900 to-indigo-800">
        <Disclosure
          as="nav"
          className="fixed top-0 z-50 w-full border-b border-indigo-300 border-opacity-25 bg-gradient-to-r from-indigo-900 to-indigo-800 lg:border-none"
        >
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                <div className="relative flex h-16 items-center justify-between lg:border-b lg:border-indigo-400 lg:border-opacity-25">
                  <div className="flex items-center px-2 lg:px-0">
                    <Link href="/">
                      <a className="flex-shrink-0">
                        <Img
                          className="block h-8 w-auto"
                          src="https://res.cloudinary.com/jaronheard/image/upload/v1665000931/mail/Shutterstock_759577369_1_tgmlow.png"
                          alt="Postage Stamp"
                          width={150}
                          height={118}
                        />
                      </a>
                    </Link>
                    <div className="hidden lg:ml-10 lg:block">
                      <div className="flex space-x-4">
                        {navigation.map((item) => (
                          <Link key={item.name} href={item.href}>
                            <a
                              className={clsx(
                                item.current
                                  ? "bg-indigo-700 text-white"
                                  : "text-white hover:bg-indigo-500 hover:bg-opacity-75",
                                "rounded-md py-2 px-3 text-sm font-medium"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              <item.Icon
                                className="mr-1.5 inline-block h-5 w-5 flex-shrink-0"
                                aria-hidden="true"
                              />
                              {item.name}
                            </a>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex lg:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-transparent p-2 text-indigo-200 hover:bg-indigo-500 hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-900">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="hidden lg:ml-4 lg:block">
                    <div className="flex items-center">
                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3 flex-shrink-0">
                        <div>
                          <Menu.Button className="rounded-full flex bg-transparent text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-900">
                            <span className="sr-only">Open user menu</span>
                            {props.user ? (
                              <Img
                                className="rounded-full h-8 w-8"
                                src={props.user.imageUrl || ""} // TODO: default image
                                height={32}
                                width={32}
                                alt=""
                              />
                            ) : (
                              <UserCircleIcon className="rounded-full h-8 w-8" />
                            )}
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
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) =>
                                  item?.href ? (
                                    <a
                                      href={item.href}
                                      className={clsx(
                                        active ? "bg-gray-100" : "",
                                        "block py-2 px-4 text-sm text-gray-700"
                                      )}
                                    >
                                      {item.name}
                                    </a>
                                  ) : (
                                    <button
                                      type="button"
                                      className={clsx(
                                        active ? "bg-gray-100" : "",
                                        "block w-full py-2 px-4 text-left text-sm text-gray-700"
                                      )}
                                      onClick={item.onClick}
                                    >
                                      {item.name}
                                    </button>
                                  )
                                }
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="lg:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={clsx(
                        item.current
                          ? "bg-indigo-700 text-white"
                          : "text-white hover:bg-indigo-500 hover:bg-opacity-75",
                        "block rounded-md py-2 px-3 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-indigo-700 pt-4 pb-3">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      {props.user ? (
                        <Img
                          className="rounded-full h-10 w-10"
                          src={props.user.imageUrl || ""}
                          alt=""
                          height={40}
                          width={40}
                        />
                      ) : (
                        <UserCircleIcon className="rounded-full h-10 w-10" />
                      )}
                    </div>
                    {props.user && (
                      <div className="ml-3">
                        <div className="text-base font-medium text-white">
                          {props.user.name}
                        </div>
                        <div className="text-sm font-medium text-indigo-300">
                          {props.user.email}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) =>
                      item?.href ? (
                        <Disclosure.Button
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block rounded-md py-2 px-3 text-base font-medium text-white hover:bg-indigo-500 hover:bg-opacity-75"
                        >
                          {item.name}
                        </Disclosure.Button>
                      ) : (
                        <Disclosure.Button
                          key={item.name}
                          as="button"
                          onClick={item.onClick}
                          className="block w-full rounded-md py-2 px-3 text-left text-base font-medium text-white hover:bg-indigo-500 hover:bg-opacity-75"
                        >
                          {item.name}
                        </Disclosure.Button>
                      )
                    )}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <header className="mb-32 py-10 pt-[6.5rem]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {props.title ||
                navigation.find((item) => item.current)?.title ||
                "Post-postcard"}
            </h1>
          </div>
        </header>

        <main className="-mt-32">
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
              {props.children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
