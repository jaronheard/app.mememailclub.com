import { signIn } from "next-auth/react";
import Img from "./Img";

export default function SignIn() {
  return (
    <>
      <div className="flex min-h-full flex-col justify-center sm:p-6 lg:p-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="py-8 px-4 sm:px-10">
            <svg
              width="26"
              height="37"
              className="mx-auto block h-12 w-auto"
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
            <div className="relative mt-6 text-lg font-medium text-gray-900 md:flex-grow">
              <p className="relative">
                To create or send postcards, use your Google Account to login.
              </p>
            </div>
            <p className="mt-6 text-sm font-medium text-gray-700">
              Sign in with
            </p>
            <div className="mt-1 grid grid-cols-1 gap-3">
              <div>
                <button
                  onClick={() => signIn("google")}
                  className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path
                        fill="#4285F4"
                        d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                      />
                      <path
                        fill="#34A853"
                        d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                      />
                    </g>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
