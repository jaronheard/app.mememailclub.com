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
import { Sen } from "@next/font/google";
import Banner from "./Banner";
import Head from "next/head";

const sen = Sen({
  variable: "--font-sen",
  weight: ["400", "700", "800"],
  subsets: ["latin"],
});

const navigation = {
  main: [
    { name: "Terms", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
  social: [
    {
      name: "Instagram",
      href: "https://www.instagram.com/post__postcard",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "https://www.twitter.com/postpostcard",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
  ],
};

function Footer() {
  return (
    <footer className="bg-yelllow">
      <div className="mx-auto max-w-7xl overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
        <nav
          className="-mx-5 -my-2 flex flex-wrap justify-center"
          aria-label="Footer"
        >
          {navigation.main.map((item) => (
            <div key={item.name} className="px-5 py-2">
              <Link
                href={item.href}
                className="text-base text-gray-500 hover:text-gray-900"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
        <div className="mt-8 flex justify-center space-x-6">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; 2022 PostPostcard. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
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
      name: "Send",
      href: "/send",
      Icon: null,
      current: ["/send"].includes(router.asPath),
      title: "Send postcards",
    },
    {
      name: "Create",
      href: "/publications",
      Icon: null,
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
      <Head>
        <title>PostPostcard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className={clsx("min-h-full bg-yellow", sen.variable)}>
        <Disclosure
          as="nav"
          className="fixed top-0 z-50 w-full bg-yellow lg:border-none"
        >
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                <div className="relative flex h-16 items-center justify-between bg-yellow">
                  <div className="flex items-center px-2 lg:px-0">
                    <Link href="/" className="flex-shrink-0">
                      <svg
                        width="26"
                        height="37"
                        className="block h-8 w-auto"
                        viewBox="0 0 26 37"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask
                          id="mask0_112_3"
                          style={{ maskType: "alpha" }}
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="26"
                          height="37"
                        >
                          <path
                            d="M15.4688 0.390625C17.25 0.390625 18.9219 0.84375 20.4844 1.75C22.0781 2.65625 23.3594 4.04688 24.3281 5.92188C25.2969 7.79688 25.7812 10.1875 25.7812 13.0938C25.7812 15.7812 25.2812 18.0625 24.2812 19.9375C23.3125 21.8125 22 23.25 20.3438 24.25C18.7188 25.2188 16.9375 25.7031 15 25.7031C13.75 25.7031 12.5156 25.4375 11.2969 24.9062C10.1094 24.3438 9.125 23.6406 8.34375 22.7969V36.25H0.28125V1.09375H8.34375V5.07812C8.9375 3.76562 9.84375 2.65625 11.0625 1.75C12.2812 0.84375 13.75 0.390625 15.4688 0.390625ZM13.0781 8.54688C12.4219 8.54688 11.7188 8.73438 10.9688 9.10938C10.25 9.45312 9.625 10 9.09375 10.75C8.59375 11.4688 8.34375 12.4062 8.34375 13.5625V15.8594C9.0625 16.4219 9.84375 16.8906 10.6875 17.2656C11.5625 17.6406 12.4375 17.8281 13.3125 17.8281C14.5 17.8281 15.4688 17.3594 16.2188 16.4219C16.9688 15.4531 17.3438 14.3438 17.3438 13.0938C17.3438 11.8125 16.9531 10.7344 16.1719 9.85938C15.3906 8.98438 14.3594 8.54688 13.0781 8.54688Z"
                            fill="black"
                          />
                        </mask>
                        <g mask="url(#mask0_112_3)">
                          <path d="M18 27V14.4V13H9V27H18Z" fill="#FC5825" />
                          <path d="M8 36V3.6V0H-1V36H8Z" fill="#120F0C" />
                          <path d="M18 13V-0.5V-2H9V13H18Z" fill="#2385F8" />
                          <path d="M26 27V14.4V13H18V27H26Z" fill="#FE0760" />
                          <path d="M26 13V-0.5V-2H18V13H26Z" fill="#5520F8" />
                        </g>
                      </svg>
                    </Link>
                    <div className="hidden lg:ml-10 lg:block">
                      <div className="flex space-x-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={clsx(
                              item.current
                                ? "bg-indigo-700 text-white"
                                : "text-black hover:bg-indigo-500 hover:bg-opacity-90 hover:text-white",
                              "rounded-md py-2 px-3 text-sm font-bold"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {/* <item.Icon
                            className="mr-1.5 inline-block h-5 w-5 flex-shrink-0"
                            aria-hidden="true"
                          /> */}
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex lg:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-transparent p-2 text-indigo-200 hover:bg-indigo-500 hover:bg-opacity-90 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-700 hover:focus:ring-white">
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
                          <Menu.Button className="rounded-full flex bg-transparent text-sm text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-900">
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
                          : "text-black hover:bg-indigo-500 hover:bg-opacity-90 hover:text-white",
                        "block rounded-md py-2 px-3 text-base font-bold"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-gray-300 pt-4 pb-3">
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
                        <div className="text-base font-bold text-black">
                          {props.user.name}
                        </div>
                        <div className="text-sm font-bold text-indigo-300">
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
                          className="block rounded-md py-2 px-3 text-base font-bold text-black hover:bg-indigo-500 hover:bg-opacity-90 hover:text-white"
                        >
                          {item.name}
                        </Disclosure.Button>
                      ) : (
                        <Disclosure.Button
                          key={item.name}
                          as="button"
                          onClick={item.onClick}
                          className="block w-full rounded-md py-2 px-3 text-left text-base font-bold text-black hover:bg-indigo-500 hover:bg-opacity-90 hover:text-white"
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
          <div className="relative mx-auto max-w-7xl bg-yellow px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-extrabold tracking-tighter">
              <span className="text-indigo">p</span>
              <span className="text-[#2385F8]">o</span>
              <span className="text-[#FC5825]">s</span>
              <span className="text-[#FE0760]">t</span>
              <span className="text-black">postcard</span>
            </h1>
          </div>
        </header>

        <main className="-mt-32">
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <Banner />
            <div className="rounded-lg bg-postcard px-5 py-6 drop-shadow-sm sm:px-6">
              {props.children}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Layout;
